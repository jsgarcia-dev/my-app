-- Script para popular o banco com dados iniciais
-- Execute este script APÓS o init-database.sql

-- Limpar dados existentes (opcional - remova se quiser preservar dados)
-- TRUNCATE professionals, services, services_offered, working_hours, professional_auth CASCADE;

-- Inserir profissionais
INSERT INTO professionals (id, name, email, phone, bio, specialties, status) VALUES
('00000000-0000-0000-0000-000000000001', 'Ana Silva', 'ana.silva@studiogarcia.com', '11999999001', 'Especialista em coloração e cortes modernos com mais de 10 anos de experiência.', ARRAY['Coloração', 'Corte', 'Escova'], 'active'),
('00000000-0000-0000-0000-000000000002', 'Beatriz Santos', 'beatriz.santos@studiogarcia.com', '11999999002', 'Maquiadora profissional especializada em makes para noivas e eventos.', ARRAY['Maquiagem', 'Design de Sobrancelhas'], 'active'),
('00000000-0000-0000-0000-000000000003', 'Carlos Oliveira', 'carlos.oliveira@studiogarcia.com', '11999999003', 'Barbeiro especializado em cortes masculinos modernos e barbas.', ARRAY['Barbearia', 'Corte Masculino'], 'active'),
('00000000-0000-0000-0000-000000000004', 'Diana Costa', 'diana.costa@studiogarcia.com', '11999999004', 'Especialista em nail art e técnicas modernas de manicure.', ARRAY['Manicure', 'Pedicure', 'Nail Art'], 'active');

-- Inserir serviços
INSERT INTO services (id, name, category, description, base_duration, base_price) VALUES
-- Serviços de Cabelo
('00000000-0000-0000-0000-000000000101', 'Corte Feminino', 'Cabelo', 'Corte feminino com lavagem e secagem', 60, 80.00),
('00000000-0000-0000-0000-000000000102', 'Coloração', 'Cabelo', 'Coloração completa com produtos premium', 180, 250.00),
('00000000-0000-0000-0000-000000000103', 'Escova Progressiva', 'Cabelo', 'Escova progressiva com produtos de qualidade', 240, 350.00),
('00000000-0000-0000-0000-000000000104', 'Mechas/Luzes', 'Cabelo', 'Mechas ou luzes com papel alumínio', 240, 300.00),
('00000000-0000-0000-0000-000000000105', 'Hidratação', 'Cabelo', 'Hidratação profunda para cabelos ressecados', 90, 120.00),
-- Serviços de Maquiagem
('00000000-0000-0000-0000-000000000201', 'Maquiagem Social', 'Maquiagem', 'Maquiagem para eventos sociais', 60, 150.00),
('00000000-0000-0000-0000-000000000202', 'Maquiagem Noiva', 'Maquiagem', 'Maquiagem especial para noivas com teste', 90, 350.00),
('00000000-0000-0000-0000-000000000203', 'Design de Sobrancelhas', 'Maquiagem', 'Design personalizado de sobrancelhas', 45, 60.00),
-- Serviços de Barbearia
('00000000-0000-0000-0000-000000000301', 'Corte Masculino', 'Barbearia', 'Corte masculino tradicional ou moderno', 45, 50.00),
('00000000-0000-0000-0000-000000000302', 'Barba', 'Barbearia', 'Aparar e desenhar barba', 30, 35.00),
('00000000-0000-0000-0000-000000000303', 'Corte + Barba', 'Barbearia', 'Combo corte e barba', 60, 75.00),
-- Serviços de Manicure
('00000000-0000-0000-0000-000000000401', 'Manicure', 'Unhas', 'Manicure completa com esmaltação', 60, 45.00),
('00000000-0000-0000-0000-000000000402', 'Pedicure', 'Unhas', 'Pedicure completa com esmaltação', 60, 50.00),
('00000000-0000-0000-0000-000000000403', 'Manicure + Pedicure', 'Unhas', 'Combo manicure e pedicure', 90, 80.00),
('00000000-0000-0000-0000-000000000404', 'Unhas em Gel', 'Unhas', 'Alongamento de unhas em gel', 120, 150.00),
('00000000-0000-0000-0000-000000000405', 'Nail Art', 'Unhas', 'Decoração artística nas unhas', 30, 40.00);

-- Associar serviços aos profissionais
INSERT INTO services_offered (professional_id, service_id) VALUES
-- Ana Silva - Cabelo
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101'),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000102'),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000103'),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000104'),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000105'),
-- Beatriz Santos - Maquiagem
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000201'),
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000202'),
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000203'),
-- Carlos Oliveira - Barbearia
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000301'),
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000302'),
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000303'),
-- Diana Costa - Manicure
('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000401'),
('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000402'),
('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000403'),
('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000404'),
('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000405');

-- Inserir horários de trabalho (Segunda a Sábado para todos)
INSERT INTO working_hours (professional_id, day_of_week, start_time, end_time, is_working) VALUES
-- Ana Silva
('00000000-0000-0000-0000-000000000001', 1, '09:00', '18:00', true), -- Segunda
('00000000-0000-0000-0000-000000000001', 2, '09:00', '18:00', true), -- Terça
('00000000-0000-0000-0000-000000000001', 3, '09:00', '18:00', true), -- Quarta
('00000000-0000-0000-0000-000000000001', 4, '09:00', '18:00', true), -- Quinta
('00000000-0000-0000-0000-000000000001', 5, '09:00', '18:00', true), -- Sexta
('00000000-0000-0000-0000-000000000001', 6, '09:00', '17:00', true), -- Sábado
('00000000-0000-0000-0000-000000000001', 0, NULL, NULL, false), -- Domingo
-- Beatriz Santos
('00000000-0000-0000-0000-000000000002', 1, '10:00', '19:00', true),
('00000000-0000-0000-0000-000000000002', 2, '10:00', '19:00', true),
('00000000-0000-0000-0000-000000000002', 3, '10:00', '19:00', true),
('00000000-0000-0000-0000-000000000002', 4, '10:00', '19:00', true),
('00000000-0000-0000-0000-000000000002', 5, '10:00', '19:00', true),
('00000000-0000-0000-0000-000000000002', 6, '10:00', '18:00', true),
('00000000-0000-0000-0000-000000000002', 0, NULL, NULL, false),
-- Carlos Oliveira
('00000000-0000-0000-0000-000000000003', 1, '08:00', '20:00', true),
('00000000-0000-0000-0000-000000000003', 2, '08:00', '20:00', true),
('00000000-0000-0000-0000-000000000003', 3, '08:00', '20:00', true),
('00000000-0000-0000-0000-000000000003', 4, '08:00', '20:00', true),
('00000000-0000-0000-0000-000000000003', 5, '08:00', '20:00', true),
('00000000-0000-0000-0000-000000000003', 6, '08:00', '18:00', true),
('00000000-0000-0000-0000-000000000003', 0, NULL, NULL, false),
-- Diana Costa
('00000000-0000-0000-0000-000000000004', 1, '09:00', '17:00', true),
('00000000-0000-0000-0000-000000000004', 2, '09:00', '17:00', true),
('00000000-0000-0000-0000-000000000004', 3, '09:00', '17:00', true),
('00000000-0000-0000-0000-000000000004', 4, '09:00', '17:00', true),
('00000000-0000-0000-0000-000000000004', 5, '09:00', '17:00', true),
('00000000-0000-0000-0000-000000000004', 6, '09:00', '16:00', true),
('00000000-0000-0000-0000-000000000004', 0, NULL, NULL, false);

-- Inserir intervalos de almoço (12:00-13:00 para todos durante a semana)
INSERT INTO working_hour_breaks (working_hour_id, start_time, end_time, reason)
SELECT id, '12:00', '13:00', 'Almoço'
FROM working_hours
WHERE day_of_week BETWEEN 1 AND 5 AND is_working = true;

-- Inserir PINs para autenticação dos profissionais
-- PINs: Ana=1234, Beatriz=2345, Carlos=3456, Diana=4567
-- Nota: Em produção, use bcrypt para hash dos PINs
INSERT INTO professional_auth (professional_id, pin_hash) VALUES
('00000000-0000-0000-0000-000000000001', '$2b$10$uwT8Z6EKK4.QN65LZrggu.Ssjno1M2cGVuG9jXfKyiST95nhFJ5/y'), -- 1234
('00000000-0000-0000-0000-000000000002', '$2b$10$5pr1r.TqVARImPF5My.vpeokrmvHN/dmbp3j.McuA8MKWRuKc3pKy'), -- 2345
('00000000-0000-0000-0000-000000000003', '$2b$10$cgzJFR.hAt5maDiiPE9aH.R02X5q0hSlpHhCgaiKta6/SvZCeY72G'), -- 3456
('00000000-0000-0000-0000-000000000004', '$2b$10$4bgceRpmpaHoRR8FDrJ5k.bZ3FK73eRiFBFj7pvA8QXA0JS8ruUYS'); -- 4567

-- Inserir alguns feriados de exemplo
INSERT INTO holidays (date, name, type) VALUES
('2025-01-01', 'Ano Novo', 'holiday'),
('2025-02-25', 'Carnaval', 'holiday'),
('2025-04-18', 'Sexta-feira Santa', 'holiday'),
('2025-04-21', 'Tiradentes', 'holiday'),
('2025-05-01', 'Dia do Trabalho', 'holiday'),
('2025-06-19', 'Corpus Christi', 'holiday'),
('2025-09-07', 'Independência do Brasil', 'holiday'),
('2025-10-12', 'Nossa Senhora Aparecida', 'holiday'),
('2025-11-02', 'Finados', 'holiday'),
('2025-11-15', 'Proclamação da República', 'holiday'),
('2025-12-25', 'Natal', 'holiday');

-- Nota: Para criar a view de slots disponíveis, execute o script create-view-simplified.sql separadamente
-- devido a limitações do PostgreSQL com generate_series em TIME