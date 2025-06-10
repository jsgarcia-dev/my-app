-- View simplificada para slots disponíveis
-- Execute este script APÓS o seed-data.sql se a view der erro

DROP VIEW IF EXISTS available_slots_view;

-- Criar tabela auxiliar de slots de tempo
CREATE TABLE IF NOT EXISTS time_slots_helper (
  slot_time TIME PRIMARY KEY
);

-- Popular com slots de 30 em 30 minutos
INSERT INTO time_slots_helper (slot_time) VALUES
('08:00'), ('08:30'), ('09:00'), ('09:30'), ('10:00'), ('10:30'),
('11:00'), ('11:30'), ('12:00'), ('12:30'), ('13:00'), ('13:30'),
('14:00'), ('14:30'), ('15:00'), ('15:30'), ('16:00'), ('16:30'),
('17:00'), ('17:30'), ('18:00'), ('18:30'), ('19:00'), ('19:30'),
('20:00')
ON CONFLICT DO NOTHING;

-- Criar view usando a tabela auxiliar
CREATE OR REPLACE VIEW available_slots_view AS
WITH date_range AS (
  SELECT generate_series(
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '30 days',
    INTERVAL '1 day'
  )::DATE as date
),
slot_intervals AS (
  SELECT 
    p.id as professional_id,
    p.name as professional_name,
    dr.date,
    ts.slot_time
  FROM professionals p
  CROSS JOIN date_range dr
  CROSS JOIN time_slots_helper ts
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
    WHEN wh.is_working = false OR wh.is_working IS NULL THEN false
    WHEN si.slot_time < wh.start_time OR si.slot_time >= wh.end_time THEN false
    WHEN EXISTS (
      SELECT 1 FROM working_hour_breaks whb
      WHERE whb.working_hour_id = wh.id
      AND si.slot_time >= whb.start_time
      AND si.slot_time < whb.end_time
    ) THEN false
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