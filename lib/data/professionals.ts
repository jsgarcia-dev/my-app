import { Professional } from '@/lib/types/booking'

export const professionals: Professional[] = [
  {
    id: '1',
    name: 'Ana Silva',
    specialties: ['Coloração', 'Corte', 'Escova'],
    avatar: 'https://via.placeholder.com/150',
    bio: 'Especialista em coloração com 10 anos de experiência',
    workingHours: {
      monday: { start: '09:00', end: '18:00', breaks: [{ start: '12:00', end: '13:00' }] },
      tuesday: { start: '09:00', end: '18:00', breaks: [{ start: '12:00', end: '13:00' }] },
      wednesday: { start: '09:00', end: '18:00', breaks: [{ start: '12:00', end: '13:00' }] },
      thursday: { start: '09:00', end: '18:00', breaks: [{ start: '12:00', end: '13:00' }] },
      friday: { start: '09:00', end: '18:00', breaks: [{ start: '12:00', end: '13:00' }] },
      saturday: { start: '09:00', end: '14:00' },
      sunday: null
    },
    servicesOffered: [
      { id: '1', name: 'Corte Feminino', duration: 60, price: 80 },
      { id: '2', name: 'Coloração', duration: 120, price: 200 },
      { id: '3', name: 'Escova Progressiva', duration: 180, price: 350 },
      { id: '4', name: 'Hidratação', duration: 60, price: 120 }
    ]
  },
  {
    id: '2',
    name: 'Beatriz Santos',
    specialties: ['Maquiagem', 'Design de Sobrancelhas'],
    avatar: 'https://via.placeholder.com/150',
    bio: 'Maquiadora profissional especializada em noivas',
    workingHours: {
      monday: { start: '10:00', end: '19:00', breaks: [{ start: '14:00', end: '15:00' }] },
      tuesday: { start: '10:00', end: '19:00', breaks: [{ start: '14:00', end: '15:00' }] },
      wednesday: { start: '10:00', end: '19:00', breaks: [{ start: '14:00', end: '15:00' }] },
      thursday: { start: '10:00', end: '19:00', breaks: [{ start: '14:00', end: '15:00' }] },
      friday: { start: '10:00', end: '19:00', breaks: [{ start: '14:00', end: '15:00' }] },
      saturday: { start: '09:00', end: '18:00' },
      sunday: null
    },
    servicesOffered: [
      { id: '5', name: 'Maquiagem Social', duration: 60, price: 150 },
      { id: '6', name: 'Maquiagem Noiva', duration: 90, price: 350 },
      { id: '7', name: 'Design de Sobrancelhas', duration: 30, price: 60 },
      { id: '8', name: 'Extensão de Cílios', duration: 120, price: 250 }
    ]
  },
  {
    id: '3',
    name: 'Carlos Oliveira',
    specialties: ['Barbearia', 'Corte Masculino'],
    avatar: 'https://via.placeholder.com/150',
    bio: 'Barbeiro tradicional com técnicas modernas',
    workingHours: {
      monday: { start: '09:00', end: '20:00', breaks: [{ start: '13:00', end: '14:00' }] },
      tuesday: { start: '09:00', end: '20:00', breaks: [{ start: '13:00', end: '14:00' }] },
      wednesday: { start: '09:00', end: '20:00', breaks: [{ start: '13:00', end: '14:00' }] },
      thursday: { start: '09:00', end: '20:00', breaks: [{ start: '13:00', end: '14:00' }] },
      friday: { start: '09:00', end: '20:00', breaks: [{ start: '13:00', end: '14:00' }] },
      saturday: { start: '08:00', end: '16:00' },
      sunday: null
    },
    servicesOffered: [
      { id: '9', name: 'Corte Masculino', duration: 30, price: 50 },
      { id: '10', name: 'Barba', duration: 30, price: 40 },
      { id: '11', name: 'Corte + Barba', duration: 45, price: 80 },
      { id: '12', name: 'Platinado', duration: 90, price: 150 }
    ]
  },
  {
    id: '4',
    name: 'Diana Costa',
    specialties: ['Manicure', 'Pedicure', 'Nail Art'],
    avatar: 'https://via.placeholder.com/150',
    bio: 'Especialista em nail art e unhas decoradas',
    workingHours: {
      monday: { start: '09:00', end: '18:00', breaks: [{ start: '12:30', end: '13:30' }] },
      tuesday: { start: '09:00', end: '18:00', breaks: [{ start: '12:30', end: '13:30' }] },
      wednesday: { start: '09:00', end: '18:00', breaks: [{ start: '12:30', end: '13:30' }] },
      thursday: { start: '09:00', end: '18:00', breaks: [{ start: '12:30', end: '13:30' }] },
      friday: { start: '09:00', end: '18:00', breaks: [{ start: '12:30', end: '13:30' }] },
      saturday: { start: '09:00', end: '15:00' },
      sunday: null
    },
    servicesOffered: [
      { id: '13', name: 'Manicure', duration: 45, price: 40 },
      { id: '14', name: 'Pedicure', duration: 60, price: 50 },
      { id: '15', name: 'Manicure + Pedicure', duration: 90, price: 80 },
      { id: '16', name: 'Unhas em Gel', duration: 90, price: 120 },
      { id: '17', name: 'Nail Art', duration: 30, price: 30 }
    ]
  }
]