# 🚀 Guia Completo de Integração com Supabase

## 📋 Índice
1. [Visão Geral](#visão-geral)
2. [Configuração Inicial](#configuração-inicial)
3. [Estrutura do Banco de Dados](#estrutura-do-banco-de-dados)
4. [Implementação Passo a Passo](#implementação-passo-a-passo)
5. [Segurança e RLS](#segurança-e-rls)
6. [Migração de Código](#migração-de-código)
7. [Funcionalidades Avançadas](#funcionalidades-avançadas)
8. [Monitoramento e Manutenção](#monitoramento-e-manutenção)

## 🎯 Visão Geral

### Por que Supabase?
- **Open Source**: Alternativa ao Firebase baseada em PostgreSQL
- **Real-time**: Atualizações em tempo real out-of-the-box
- **Auth Integrado**: Sistema de autenticação completo
- **Storage**: Para imagens de perfil e documentos
- **Free Tier Generoso**: 500MB database, 1GB storage, 50k auth users

### Arquitetura Final
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Next.js App   │────▶│ Supabase Client │────▶│  PostgreSQL DB  │
│                 │     │   (Real-time)   │     │   (Supabase)   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                                               │
         └───────────────── RLS Policies ────────────────┘
```

## 🛠️ Configuração Inicial

### Passo 1: Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e crie uma conta
2. Clique em "New Project"
3. Configure:
   - **Name**: studio-garcia-beauty
   - **Database Password**: (gere uma senha forte)
   - **Region**: São Paulo (para menor latência)
   - **Pricing Plan**: Free (início)

### Passo 2: Instalar Dependências

```bash
# Instalar cliente Supabase
pnpm add @supabase/supabase-js

# Instalar CLI para desenvolvimento local (opcional)
pnpm add -D supabase

# Tipos TypeScript gerados automaticamente
pnpm add -D @supabase/auth-helpers-nextjs
```

### Passo 3: Configurar Variáveis de Ambiente

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🗄️ Estrutura do Banco de Dados

### Diagrama ER Completo

```sql
-- Tabelas principais e seus relacionamentos
professionals (1) ──── (N) services_offered
    │                         │
    │                         │
    ├─── (N) bookings ────────┘
    │
    ├─── (N) availability_settings
    │
    ├─── (N) working_hours
    │
    └─── (1) professional_auth
```

### Tabelas Detalhadas

#### 1. **professionals** - Profissionais do salão
```sql
CREATE TABLE professionals (
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
CREATE INDEX idx_professionals_status ON professionals(status);
CREATE INDEX idx_professionals_email ON professionals(email);
```

#### 2. **services** - Catálogo de serviços
```sql
CREATE TABLE services (
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
CREATE INDEX idx_services_category ON services(category);
CREATE INDEX idx_services_status ON services(status);
```

#### 3. **services_offered** - Relação profissional-serviço
```sql
CREATE TABLE services_offered (
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
CREATE INDEX idx_services_offered_professional ON services_offered(professional_id);
CREATE INDEX idx_services_offered_service ON services_offered(service_id);
```

#### 4. **working_hours** - Horários padrão de trabalho
```sql
CREATE TABLE working_hours (
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
CREATE INDEX idx_working_hours_professional ON working_hours(professional_id);
```

#### 5. **working_hour_breaks** - Intervalos/pausas
```sql
CREATE TABLE working_hour_breaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  working_hour_id UUID REFERENCES working_hours(id) ON DELETE CASCADE,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  reason TEXT DEFAULT 'break',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice
CREATE INDEX idx_breaks_working_hour ON working_hour_breaks(working_hour_id);
```

#### 6. **bookings** - Agendamentos
```sql
CREATE TABLE bookings (
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
  confirmation_token TEXT UNIQUE DEFAULT gen_random_uuid(),
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
CREATE INDEX idx_bookings_professional_date ON bookings(professional_id, date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_date ON bookings(date);
CREATE INDEX idx_bookings_confirmation_token ON bookings(confirmation_token);
CREATE INDEX idx_bookings_customer_phone ON bookings(customer_phone);
```

#### 7. **availability_settings** - Disponibilidade customizada
```sql
CREATE TABLE availability_settings (
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
CREATE INDEX idx_availability_professional_date ON availability_settings(professional_id, date);
CREATE INDEX idx_availability_date ON availability_settings(date);
```

#### 8. **availability_breaks** - Intervalos customizados
```sql
CREATE TABLE availability_breaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  availability_setting_id UUID REFERENCES availability_settings(id) ON DELETE CASCADE,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 9. **professional_auth** - Autenticação simplificada
```sql
CREATE TABLE professional_auth (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID REFERENCES professionals(id) ON DELETE CASCADE UNIQUE,
  pin_hash TEXT NOT NULL, -- Hash do PIN
  last_login TIMESTAMPTZ,
  failed_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 10. **holidays** - Feriados e fechamentos gerais
```sql
CREATE TABLE holidays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'holiday' CHECK (type IN ('holiday', 'closure', 'special')),
  affects_all BOOLEAN DEFAULT true,
  affected_professional_ids UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice
CREATE INDEX idx_holidays_date ON holidays(date);
```

#### 11. **notifications** - Sistema de notificações
```sql
CREATE TABLE notifications (
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
CREATE INDEX idx_notifications_booking ON notifications(booking_id);
CREATE INDEX idx_notifications_status_scheduled ON notifications(status, scheduled_for);
```

#### 12. **waiting_list** - Lista de espera
```sql
CREATE TABLE waiting_list (
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
CREATE INDEX idx_waiting_list_professional ON waiting_list(professional_id);
CREATE INDEX idx_waiting_list_status ON waiting_list(status);
```

### Views Úteis

#### 1. **available_slots_view** - Slots disponíveis em tempo real
```sql
CREATE OR REPLACE VIEW available_slots_view AS
WITH slot_intervals AS (
  SELECT 
    p.id as professional_id,
    p.name as professional_name,
    generate_series(
      CURRENT_DATE,
      CURRENT_DATE + INTERVAL '30 days',
      INTERVAL '1 day'
    )::DATE as date,
    generate_series(
      '08:00'::TIME,
      '20:00'::TIME,
      INTERVAL '30 minutes'
    )::TIME as slot_time
  FROM professionals p
  WHERE p.status = 'active'
)
SELECT DISTINCT
  si.professional_id,
  si.professional_name,
  si.date,
  si.slot_time,
  CASE 
    WHEN b.id IS NOT NULL THEN false
    WHEN h.id IS NOT NULL THEN false
    WHEN avs.is_available = false THEN false
    WHEN wh.is_working = false THEN false
    ELSE true
  END as is_available
FROM slot_intervals si
LEFT JOIN working_hours wh ON 
  wh.professional_id = si.professional_id 
  AND wh.day_of_week = EXTRACT(DOW FROM si.date)
LEFT JOIN availability_settings avs ON 
  avs.professional_id = si.professional_id 
  AND avs.date = si.date
LEFT JOIN bookings b ON 
  b.professional_id = si.professional_id 
  AND b.date = si.date 
  AND b.status NOT IN ('cancelled')
  AND si.slot_time >= b.start_time 
  AND si.slot_time < b.end_time
LEFT JOIN holidays h ON 
  h.date = si.date 
  AND (h.affects_all = true OR si.professional_id = ANY(h.affected_professional_ids))
WHERE si.date >= CURRENT_DATE;
```

#### 2. **booking_analytics_view** - Analytics de agendamentos
```sql
CREATE OR REPLACE VIEW booking_analytics_view AS
SELECT 
  p.id as professional_id,
  p.name as professional_name,
  DATE_TRUNC('month', b.date) as month,
  COUNT(*) as total_bookings,
  COUNT(*) FILTER (WHERE b.status = 'completed') as completed_bookings,
  COUNT(*) FILTER (WHERE b.status = 'cancelled') as cancelled_bookings,
  COUNT(*) FILTER (WHERE b.status = 'no_show') as no_show_bookings,
  SUM(b.price) FILTER (WHERE b.payment_status = 'paid') as total_revenue,
  AVG(b.rating) as average_rating,
  COUNT(DISTINCT b.customer_phone) as unique_customers
FROM professionals p
LEFT JOIN bookings b ON b.professional_id = p.id
GROUP BY p.id, p.name, DATE_TRUNC('month', b.date);
```

### Triggers e Functions

#### 1. **Atualizar updated_at automaticamente**
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar a todas as tabelas com updated_at
CREATE TRIGGER update_professionals_updated_at BEFORE UPDATE ON professionals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
-- ... repetir para outras tabelas
```

#### 2. **Validar conflitos de horário**
```sql
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
```

#### 3. **Criar notificações automaticamente**
```sql
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
FOR EACH ROW EXECUTE FUNCTION create_booking_notifications();
```

## 🔐 Segurança e RLS

### Políticas de Segurança (Row Level Security)

#### 1. Habilitar RLS em todas as tabelas
```sql
-- Habilitar RLS
ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
-- ... para todas as tabelas
```

#### 2. Políticas para Profissionais
```sql
-- Profissionais podem ver seus próprios dados
CREATE POLICY "Professionals can view own data" ON professionals
  FOR SELECT USING (auth.uid() = id);

-- Profissionais podem atualizar seus próprios dados
CREATE POLICY "Professionals can update own data" ON professionals
  FOR UPDATE USING (auth.uid() = id);

-- Todos podem ver profissionais ativos (para listagem pública)
CREATE POLICY "Public can view active professionals" ON professionals
  FOR SELECT USING (status = 'active');
```

#### 3. Políticas para Agendamentos
```sql
-- Profissionais veem seus agendamentos
CREATE POLICY "Professionals view own bookings" ON bookings
  FOR SELECT USING (
    professional_id IN (
      SELECT id FROM professionals WHERE auth.uid() = id
    )
  );

-- Clientes veem seus agendamentos via token
CREATE POLICY "Customers view bookings by token" ON bookings
  FOR SELECT USING (
    confirmation_token = current_setting('app.current_token', true)
  );

-- Sistema pode criar agendamentos (via service role)
CREATE POLICY "System can create bookings" ON bookings
  FOR INSERT WITH CHECK (true);
```

## 🔄 Migração de Código

### Passo 1: Criar Cliente Supabase

```typescript
// lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Para operações do servidor (com mais permissões)
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)
```

### Passo 2: Gerar Tipos TypeScript

```bash
# Instalar CLI do Supabase
pnpm add -D supabase

# Login
npx supabase login

# Gerar tipos
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/supabase.ts
```

### Passo 3: Migrar Storage de Bookings

```typescript
// lib/storage/bookings.ts
import { supabaseAdmin } from '@/lib/supabase/client'
import { Booking } from '@/lib/types/booking'

export const bookingStorage = {
  getAll: async (): Promise<Booking[]> => {
    const { data, error } = await supabaseAdmin
      .from('bookings')
      .select(`
        *,
        professional:professionals(*),
        service:services(*)
      `)
      .order('date', { ascending: true })
    
    if (error) throw error
    return data || []
  },

  getById: async (id: string): Promise<Booking | null> => {
    const { data, error } = await supabaseAdmin
      .from('bookings')
      .select(`
        *,
        professional:professionals(*),
        service:services(*)
      `)
      .eq('id', id)
      .single()
    
    if (error) return null
    return data
  },

  getByToken: async (token: string): Promise<Booking | null> => {
    const { data, error } = await supabaseAdmin
      .from('bookings')
      .select(`
        *,
        professional:professionals(*),
        service:services(*)
      `)
      .eq('confirmation_token', token)
      .single()
    
    if (error) return null
    return data
  },

  getByProfessional: async (professionalId: string): Promise<Booking[]> => {
    const { data, error } = await supabaseAdmin
      .from('bookings')
      .select(`
        *,
        professional:professionals(*),
        service:services(*)
      `)
      .eq('professional_id', professionalId)
      .gte('date', new Date().toISOString().split('T')[0])
      .order('date', { ascending: true })
      .order('start_time', { ascending: true })
    
    if (error) throw error
    return data || []
  },

  create: async (booking: Omit<Booking, 'id' | 'created_at'>): Promise<Booking> => {
    const { data, error } = await supabaseAdmin
      .from('bookings')
      .insert(booking)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  update: async (id: string, updates: Partial<Booking>): Promise<Booking | null> => {
    const { data, error } = await supabaseAdmin
      .from('bookings')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) return null
    return data
  },

  delete: async (id: string): Promise<boolean> => {
    const { error } = await supabaseAdmin
      .from('bookings')
      .delete()
      .eq('id', id)
    
    return !error
  }
}
```

### Passo 4: Implementar Real-time

```typescript
// hooks/useRealtimeBookings.ts
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Booking } from '@/lib/types/booking'

export function useRealtimeBookings(professionalId: string) {
  const [bookings, setBookings] = useState<Booking[]>([])

  useEffect(() => {
    // Buscar inicial
    const fetchBookings = async () => {
      const { data } = await supabase
        .from('bookings')
        .select('*')
        .eq('professional_id', professionalId)
        .gte('date', new Date().toISOString().split('T')[0])
      
      if (data) setBookings(data)
    }

    fetchBookings()

    // Inscrever para mudanças
    const subscription = supabase
      .channel('bookings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter: `professional_id=eq.${professionalId}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setBookings(prev => [...prev, payload.new as Booking])
          } else if (payload.eventType === 'UPDATE') {
            setBookings(prev => 
              prev.map(b => b.id === payload.new.id ? payload.new as Booking : b)
            )
          } else if (payload.eventType === 'DELETE') {
            setBookings(prev => prev.filter(b => b.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [professionalId])

  return bookings
}
```

### Passo 5: Migrar Autenticação

```typescript
// lib/auth/professional-auth.ts
import { supabaseAdmin } from '@/lib/supabase/client'
import bcrypt from 'bcryptjs'

export async function validatePin(professionalId: string, pin: string): Promise<boolean> {
  const { data: auth } = await supabaseAdmin
    .from('professional_auth')
    .select('pin_hash, failed_attempts, locked_until')
    .eq('professional_id', professionalId)
    .single()

  if (!auth) return false

  // Verificar se está bloqueado
  if (auth.locked_until && new Date(auth.locked_until) > new Date()) {
    return false
  }

  const isValid = await bcrypt.compare(pin, auth.pin_hash)

  if (isValid) {
    // Reset tentativas falhas
    await supabaseAdmin
      .from('professional_auth')
      .update({ 
        failed_attempts: 0,
        last_login: new Date().toISOString()
      })
      .eq('professional_id', professionalId)
  } else {
    // Incrementar tentativas falhas
    const newAttempts = (auth.failed_attempts || 0) + 1
    const updates: any = { failed_attempts: newAttempts }
    
    // Bloquear após 5 tentativas
    if (newAttempts >= 5) {
      updates.locked_until = new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 min
    }
    
    await supabaseAdmin
      .from('professional_auth')
      .update(updates)
      .eq('professional_id', professionalId)
  }

  return isValid
}
```

## 🚀 Funcionalidades Avançadas

### 1. Busca Inteligente de Horários

```sql
-- Function para buscar próximos horários disponíveis
CREATE OR REPLACE FUNCTION find_next_available_slots(
  p_professional_id UUID,
  p_service_id UUID,
  p_preferred_date DATE DEFAULT CURRENT_DATE,
  p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
  slot_date DATE,
  slot_time TIME,
  duration INTEGER
) AS $$
BEGIN
  RETURN QUERY
  WITH service_info AS (
    SELECT 
      COALESCE(so.custom_duration, s.base_duration) as duration
    FROM services s
    LEFT JOIN services_offered so ON 
      so.service_id = s.id AND 
      so.professional_id = p_professional_id
    WHERE s.id = p_service_id
  )
  SELECT 
    av.date as slot_date,
    av.slot_time,
    si.duration
  FROM available_slots_view av
  CROSS JOIN service_info si
  WHERE 
    av.professional_id = p_professional_id
    AND av.date >= p_preferred_date
    AND av.is_available = true
    AND NOT EXISTS (
      -- Verificar se há espaço suficiente para o serviço
      SELECT 1 FROM bookings b
      WHERE b.professional_id = p_professional_id
      AND b.date = av.date
      AND b.status NOT IN ('cancelled')
      AND (
        (av.slot_time >= b.start_time AND av.slot_time < b.end_time) OR
        ((av.slot_time + (si.duration || ' minutes')::INTERVAL) > b.start_time 
          AND (av.slot_time + (si.duration || ' minutes')::INTERVAL) <= b.end_time)
      )
    )
  ORDER BY av.date, av.slot_time
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;
```

### 2. Sistema de Recomendação

```sql
-- View para profissionais recomendados baseado em histórico
CREATE OR REPLACE VIEW recommended_professionals AS
WITH customer_history AS (
  SELECT 
    customer_phone,
    professional_id,
    COUNT(*) as visit_count,
    AVG(rating) as avg_rating,
    MAX(date) as last_visit
  FROM bookings
  WHERE status = 'completed'
  GROUP BY customer_phone, professional_id
),
service_popularity AS (
  SELECT 
    service_id,
    COUNT(*) as booking_count,
    AVG(rating) as avg_rating
  FROM bookings
  WHERE status = 'completed'
  GROUP BY service_id
)
SELECT DISTINCT
  ch.customer_phone,
  p.id as recommended_professional_id,
  p.name as professional_name,
  p.specialties,
  CASE
    WHEN ch2.professional_id IS NOT NULL THEN 'previously_visited'
    WHEN sp.avg_rating > 4.5 THEN 'highly_rated'
    WHEN sp.booking_count > 50 THEN 'popular'
    ELSE 'new_talent'
  END as recommendation_reason,
  COALESCE(ch2.avg_rating, 0) as customer_rating,
  COALESCE(sp.avg_rating, 0) as service_rating
FROM customer_history ch
CROSS JOIN professionals p
LEFT JOIN customer_history ch2 ON 
  ch2.customer_phone = ch.customer_phone AND 
  ch2.professional_id = p.id
LEFT JOIN services_offered so ON so.professional_id = p.id
LEFT JOIN service_popularity sp ON sp.service_id = so.service_id
WHERE p.status = 'active'
  AND p.id != ch.professional_id; -- Não recomendar o mesmo profissional
```

### 3. Dashboard Analytics

```typescript
// lib/analytics/dashboard.ts
export async function getDashboardStats(professionalId: string) {
  const today = new Date().toISOString().split('T')[0]
  const monthStart = new Date()
  monthStart.setDate(1)
  
  // Estatísticas do dia
  const { data: todayStats } = await supabase
    .from('bookings')
    .select('id, status, price')
    .eq('professional_id', professionalId)
    .eq('date', today)
  
  // Estatísticas do mês
  const { data: monthStats } = await supabase
    .from('booking_analytics_view')
    .select('*')
    .eq('professional_id', professionalId)
    .eq('month', monthStart.toISOString().slice(0, 7))
    .single()
  
  // Próximos agendamentos
  const { data: upcomingBookings } = await supabase
    .from('bookings')
    .select(`
      *,
      service:services(name),
      customer_name
    `)
    .eq('professional_id', professionalId)
    .gte('date', today)
    .order('date', { ascending: true })
    .order('start_time', { ascending: true })
    .limit(5)
  
  // Taxa de ocupação
  const { data: occupancyData } = await supabase
    .rpc('calculate_occupancy_rate', {
      p_professional_id: professionalId,
      p_start_date: monthStart.toISOString().split('T')[0],
      p_end_date: today
    })
  
  return {
    today: {
      total: todayStats?.length || 0,
      confirmed: todayStats?.filter(b => b.status === 'confirmed').length || 0,
      revenue: todayStats?.reduce((sum, b) => sum + (b.price || 0), 0) || 0
    },
    month: {
      total: monthStats?.total_bookings || 0,
      completed: monthStats?.completed_bookings || 0,
      cancelled: monthStats?.cancelled_bookings || 0,
      revenue: monthStats?.total_revenue || 0,
      rating: monthStats?.average_rating || 0,
      uniqueCustomers: monthStats?.unique_customers || 0
    },
    upcoming: upcomingBookings || [],
    occupancyRate: occupancyData?.rate || 0
  }
}
```

### 4. Sistema de Notificações

```typescript
// lib/notifications/whatsapp.ts
import { supabase } from '@/lib/supabase/client'

interface WhatsAppMessage {
  to: string
  template: string
  params: Record<string, string>
}

export async function sendWhatsAppNotification(message: WhatsAppMessage) {
  // Integração com Twilio ou WhatsApp Business API
  const response = await fetch('/api/whatsapp/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message)
  })
  
  const result = await response.json()
  
  // Registrar no banco
  await supabase
    .from('notification_logs')
    .insert({
      type: 'whatsapp',
      recipient: message.to,
      template: message.template,
      status: result.success ? 'sent' : 'failed',
      error: result.error
    })
  
  return result
}

// Processar fila de notificações
export async function processNotificationQueue() {
  const { data: pending } = await supabase
    .from('notifications')
    .select('*')
    .eq('status', 'pending')
    .lte('scheduled_for', new Date().toISOString())
    .limit(10)
  
  for (const notification of pending || []) {
    try {
      await sendWhatsAppNotification({
        to: notification.recipient_phone,
        template: notification.type,
        params: notification.params
      })
      
      await supabase
        .from('notifications')
        .update({ 
          status: 'sent',
          sent_at: new Date().toISOString()
        })
        .eq('id', notification.id)
    } catch (error) {
      await supabase
        .from('notifications')
        .update({ 
          status: 'failed',
          error_message: error.message,
          retry_count: notification.retry_count + 1
        })
        .eq('id', notification.id)
    }
  }
}
```

## 📊 Monitoramento e Manutenção

### 1. Jobs Agendados (Cron)

```sql
-- Limpar agendamentos antigos
CREATE OR REPLACE FUNCTION cleanup_old_bookings()
RETURNS void AS $$
BEGIN
  -- Arquivar agendamentos com mais de 1 ano
  INSERT INTO bookings_archive
  SELECT * FROM bookings
  WHERE date < CURRENT_DATE - INTERVAL '1 year';
  
  -- Deletar após arquivar
  DELETE FROM bookings
  WHERE date < CURRENT_DATE - INTERVAL '1 year';
  
  -- Limpar notificações antigas
  DELETE FROM notifications
  WHERE created_at < CURRENT_DATE - INTERVAL '90 days'
  AND status IN ('sent', 'failed');
END;
$$ LANGUAGE plpgsql;

-- Agendar para rodar mensalmente
SELECT cron.schedule('cleanup-old-data', '0 2 1 * *', 'SELECT cleanup_old_bookings()');
```

### 2. Monitoramento de Performance

```sql
-- View para monitorar queries lentas
CREATE OR REPLACE VIEW slow_queries_monitor AS
SELECT 
  query,
  calls,
  total_time,
  mean_time,
  max_time,
  stddev_time
FROM pg_stat_statements
WHERE mean_time > 100 -- queries com mais de 100ms
ORDER BY mean_time DESC
LIMIT 20;

-- Índices sugeridos baseado em uso
CREATE OR REPLACE VIEW suggested_indexes AS
SELECT 
  schemaname,
  tablename,
  attname,
  n_distinct,
  correlation
FROM pg_stats
WHERE schemaname = 'public'
  AND n_distinct > 100
  AND correlation < 0.1
ORDER BY n_distinct DESC;
```

### 3. Backup e Recovery

```bash
# Script de backup automático
#!/bin/bash
# backup-supabase.sh

PROJECT_REF="your-project-ref"
DB_PASSWORD="your-db-password"
BACKUP_DIR="/backups/supabase"
DATE=$(date +%Y%m%d_%H%M%S)

# Criar backup
pg_dump \
  -h db.${PROJECT_REF}.supabase.co \
  -p 5432 \
  -U postgres \
  -d postgres \
  -f ${BACKUP_DIR}/backup_${DATE}.sql

# Comprimir
gzip ${BACKUP_DIR}/backup_${DATE}.sql

# Remover backups com mais de 30 dias
find ${BACKUP_DIR} -name "backup_*.sql.gz" -mtime +30 -delete

# Upload para S3 ou outro storage
aws s3 cp ${BACKUP_DIR}/backup_${DATE}.sql.gz s3://your-backup-bucket/
```

## 🎯 Checklist de Implementação

### Fase 1: Setup Inicial (1-2 dias)
- [ ] Criar projeto no Supabase
- [ ] Configurar variáveis de ambiente
- [ ] Executar scripts SQL de criação das tabelas
- [ ] Gerar tipos TypeScript
- [ ] Configurar cliente Supabase

### Fase 2: Migração de Dados (2-3 dias)
- [ ] Migrar dados dos profissionais
- [ ] Importar serviços e preços
- [ ] Configurar horários de trabalho
- [ ] Migrar agendamentos existentes (se houver)

### Fase 3: Adaptar Código (3-4 dias)
- [ ] Substituir storage in-memory pelo Supabase
- [ ] Implementar autenticação com PIN
- [ ] Adaptar formulários de agendamento
- [ ] Atualizar painel admin

### Fase 4: Funcionalidades Avançadas (1 semana)
- [ ] Implementar real-time updates
- [ ] Configurar sistema de notificações
- [ ] Criar dashboard analytics
- [ ] Implementar busca inteligente

### Fase 5: Testes e Deploy (2-3 dias)
- [ ] Testes de integração
- [ ] Testes de carga
- [ ] Configurar monitoramento
- [ ] Deploy em produção

## 🔗 Recursos Úteis

- [Documentação Supabase](https://supabase.com/docs)
- [Supabase SQL Editor](https://app.supabase.com/project/_/sql)
- [PostgREST API](https://postgrest.org/en/stable/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase CLI](https://supabase.com/docs/guides/cli)

## 🏁 Conclusão

Este guia fornece uma base sólida para migrar o sistema de agendamentos para o Supabase. A estrutura proposta é escalável, segura e aproveita os recursos modernos do PostgreSQL e Supabase para criar um sistema robusto de agendamentos.

Lembre-se de:
1. Sempre testar em ambiente de desenvolvimento primeiro
2. Fazer backups antes de grandes mudanças
3. Implementar monitoramento desde o início
4. Documentar customizações e decisões técnicas

Com esta implementação, o Studio Garcia Beauty Academy terá um sistema profissional capaz de escalar com o crescimento do negócio! 🚀