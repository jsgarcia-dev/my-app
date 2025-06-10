-- Script para inicializar o banco de dados do Studio Garcia Beauty Academy
-- Execute este script no SQL Editor do Supabase

-- 1. Tabela de profissionais
CREATE TABLE IF NOT EXISTS professionals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  avatar_url TEXT,
  bio TEXT,
  specialties TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_vacation')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_professionals_status ON professionals(status);
CREATE INDEX IF NOT EXISTS idx_professionals_email ON professionals(email);

-- 2. Tabela de serviços
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  base_duration INTEGER NOT NULL, -- em minutos
  base_price DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_services_status ON services(status);

-- 3. Tabela de serviços oferecidos
CREATE TABLE IF NOT EXISTS services_offered (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID REFERENCES professionals(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  custom_duration INTEGER, -- sobrescreve duração base se definido
  custom_price DECIMAL(10,2), -- sobrescreve preço base se definido
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(professional_id, service_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_services_offered_professional ON services_offered(professional_id);
CREATE INDEX IF NOT EXISTS idx_services_offered_service ON services_offered(service_id);

-- 4. Tabela de horários de trabalho
CREATE TABLE IF NOT EXISTS working_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID REFERENCES professionals(id) ON DELETE CASCADE,
  day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Dom, 6=Sáb
  start_time TIME,
  end_time TIME,
  is_working BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(professional_id, day_of_week)
);

-- Índice
CREATE INDEX IF NOT EXISTS idx_working_hours_professional ON working_hours(professional_id);

-- 5. Tabela de intervalos nos horários de trabalho
CREATE TABLE IF NOT EXISTS working_hour_breaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  working_hour_id UUID REFERENCES working_hours(id) ON DELETE CASCADE,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  reason TEXT DEFAULT 'break',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice
CREATE INDEX IF NOT EXISTS idx_breaks_working_hour ON working_hour_breaks(working_hour_id);

-- 6. Tabela de agendamentos
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID REFERENCES professionals(id),
  service_id UUID REFERENCES services(id),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  duration INTEGER NOT NULL, -- em minutos
  price DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending', 'confirmed', 'cancelled', 'completed', 'no_show'
  )),
  cancellation_reason TEXT,
  cancelled_at TIMESTAMPTZ,
  cancelled_by TEXT, -- 'customer' ou 'professional'
  notes TEXT,
  confirmation_token TEXT UNIQUE DEFAULT gen_random_uuid()::TEXT,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN (
    'pending', 'paid', 'refunded', 'partial'
  )),
  payment_method TEXT,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  review_text TEXT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_bookings_professional_date ON bookings(professional_id, date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(date);
CREATE INDEX IF NOT EXISTS idx_bookings_confirmation_token ON bookings(confirmation_token);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_phone ON bookings(customer_phone);

-- 7. Tabela de configurações de disponibilidade
CREATE TABLE IF NOT EXISTS availability_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID REFERENCES professionals(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  is_available BOOLEAN DEFAULT true,
  custom_start_time TIME,
  custom_end_time TIME,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(professional_id, date)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_availability_professional_date ON availability_settings(professional_id, date);
CREATE INDEX IF NOT EXISTS idx_availability_date ON availability_settings(date);

-- 8. Tabela de intervalos customizados
CREATE TABLE IF NOT EXISTS availability_breaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  availability_setting_id UUID REFERENCES availability_settings(id) ON DELETE CASCADE,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Tabela de autenticação dos profissionais
CREATE TABLE IF NOT EXISTS professional_auth (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID REFERENCES professionals(id) ON DELETE CASCADE UNIQUE,
  pin_hash TEXT NOT NULL,
  last_login TIMESTAMPTZ,
  failed_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Tabela de feriados
CREATE TABLE IF NOT EXISTS holidays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'holiday' CHECK (type IN ('holiday', 'closure', 'special')),
  affects_all BOOLEAN DEFAULT true,
  affected_professional_ids UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice
CREATE INDEX IF NOT EXISTS idx_holidays_date ON holidays(date);

-- 11. Tabela de notificações
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN (
    'booking_confirmation', 'booking_reminder', 'booking_cancelled',
    'review_request', 'professional_notification'
  )),
  channel TEXT NOT NULL CHECK (channel IN ('whatsapp', 'email', 'sms', 'push')),
  recipient_phone TEXT,
  recipient_email TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  sent_at TIMESTAMPTZ,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  scheduled_for TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_notifications_booking ON notifications(booking_id);
CREATE INDEX IF NOT EXISTS idx_notifications_status_scheduled ON notifications(status, scheduled_for);

-- 12. Tabela de lista de espera
CREATE TABLE IF NOT EXISTS waiting_list (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID REFERENCES professionals(id),
  service_id UUID REFERENCES services(id),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  preferred_dates DATE[] DEFAULT '{}',
  preferred_times TEXT[] DEFAULT '{}', -- ['morning', 'afternoon', 'evening']
  flexibility TEXT DEFAULT 'flexible' CHECK (flexibility IN (
    'exact_date', 'flexible_week', 'flexible'
  )),
  status TEXT DEFAULT 'waiting' CHECK (status IN (
    'waiting', 'notified', 'booked', 'expired', 'cancelled'
  )),
  expires_at DATE DEFAULT (CURRENT_DATE + INTERVAL '30 days'),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_waiting_list_professional ON waiting_list(professional_id);
CREATE INDEX IF NOT EXISTS idx_waiting_list_status ON waiting_list(status);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar triggers para atualizar updated_at
CREATE TRIGGER update_professionals_updated_at BEFORE UPDATE ON professionals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
CREATE TRIGGER update_working_hours_updated_at BEFORE UPDATE ON working_hours
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
CREATE TRIGGER update_availability_settings_updated_at BEFORE UPDATE ON availability_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
CREATE TRIGGER update_professional_auth_updated_at BEFORE UPDATE ON professional_auth
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
CREATE TRIGGER update_waiting_list_updated_at BEFORE UPDATE ON waiting_list
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para validar conflitos de horário
CREATE OR REPLACE FUNCTION check_booking_conflicts()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM bookings
    WHERE professional_id = NEW.professional_id
    AND date = NEW.date
    AND status NOT IN ('cancelled')
    AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000')
    AND (
      (NEW.start_time >= start_time AND NEW.start_time < end_time) OR
      (NEW.end_time > start_time AND NEW.end_time <= end_time) OR
      (NEW.start_time <= start_time AND NEW.end_time >= end_time)
    )
  ) THEN
    RAISE EXCEPTION 'Conflito de horário detectado';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_booking_conflicts_trigger
BEFORE INSERT OR UPDATE ON bookings
FOR EACH ROW EXECUTE FUNCTION check_booking_conflicts();

-- Função para criar notificações automaticamente
CREATE OR REPLACE FUNCTION create_booking_notifications()
RETURNS TRIGGER AS $$
BEGIN
  -- Notificação de confirmação
  INSERT INTO notifications (
    booking_id, type, channel, recipient_phone, scheduled_for
  ) VALUES (
    NEW.id, 'booking_confirmation', 'whatsapp', NEW.customer_phone, NOW()
  );
  
  -- Lembrete 24h antes
  INSERT INTO notifications (
    booking_id, type, channel, recipient_phone, scheduled_for
  ) VALUES (
    NEW.id, 'booking_reminder', 'whatsapp', NEW.customer_phone, 
    (NEW.date + NEW.start_time - INTERVAL '24 hours')
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_booking_notifications_trigger
AFTER INSERT ON bookings
FOR EACH ROW 
WHEN (NEW.status = 'confirmed')
EXECUTE FUNCTION create_booking_notifications();

-- Habilitar RLS (Row Level Security) em todas as tabelas
ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE services_offered ENABLE ROW LEVEL SECURITY;
ALTER TABLE working_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE working_hour_breaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_breaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE professional_auth ENABLE ROW LEVEL SECURITY;
ALTER TABLE holidays ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE waiting_list ENABLE ROW LEVEL SECURITY;

-- Políticas básicas de segurança (ajustar conforme necessário)

-- Todos podem ver profissionais ativos
CREATE POLICY "Public can view active professionals" ON professionals
  FOR SELECT USING (status = 'active');

-- Todos podem ver serviços ativos
CREATE POLICY "Public can view active services" ON services
  FOR SELECT USING (status = 'active');

-- Todos podem ver serviços oferecidos disponíveis
CREATE POLICY "Public can view available services_offered" ON services_offered
  FOR SELECT USING (is_available = true);

-- Todos podem ver horários de trabalho
CREATE POLICY "Public can view working_hours" ON working_hours
  FOR SELECT USING (true);

-- Sistema pode criar agendamentos (via service role)
CREATE POLICY "Service role can manage bookings" ON bookings
  FOR ALL USING (true);

-- Clientes podem ver seus agendamentos via token
CREATE POLICY "Customers can view bookings by token" ON bookings
  FOR SELECT USING (confirmation_token = current_setting('app.current_token', true));

-- Sistema pode gerenciar disponibilidades (via service role)
CREATE POLICY "Service role can manage availability" ON availability_settings
  FOR ALL USING (true);

-- Sistema pode gerenciar notificações (via service role)
CREATE POLICY "Service role can manage notifications" ON notifications
  FOR ALL USING (true);

-- Sistema pode gerenciar lista de espera (via service role)
CREATE POLICY "Service role can manage waiting_list" ON waiting_list
  FOR ALL USING (true);

-- Sistema pode gerenciar autenticação (via service role)
CREATE POLICY "Service role can manage professional_auth" ON professional_auth
  FOR ALL USING (true);

-- Todos podem ver feriados
CREATE POLICY "Public can view holidays" ON holidays
  FOR SELECT USING (true);