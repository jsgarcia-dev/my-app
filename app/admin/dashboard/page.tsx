'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { format, startOfWeek, addDays, parseISO, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'
import { Calendar, Clock, Users, LogOut, CheckCircle, XCircle, AlertCircle, Settings, BarChart, CalendarDays } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AuthGuard } from '@/components/admin/AuthGuard'
import { AvailabilityManager } from '@/components/admin/AvailabilityManager'
import { professionals } from '@/lib/data/professionals'
import { Booking, Professional } from '@/lib/types/booking'
import { cn } from '@/lib/utils'

export default function AdminDashboardPage() {
  const router = useRouter()
  const [professional, setProfessional] = useState<Professional | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const professionalId = sessionStorage.getItem('adminProfessionalId')
    if (professionalId) {
      const prof = professionals.find(p => p.id === professionalId)
      setProfessional(prof || null)
      fetchBookings(professionalId)
    }
  }, [])

  const fetchBookings = async (professionalId: string) => {
    try {
      const response = await fetch(`/api/bookings?professionalId=${professionalId}`)
      if (response.ok) {
        const data = await response.json()
        setBookings(data)
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth')
    sessionStorage.removeItem('adminProfessionalId')
    router.push('/admin')
  }

  const updateBookingStatus = async (bookingId: string, status: Booking['status']) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })

      if (response.ok) {
        // Refresh bookings
        if (professional) {
          fetchBookings(professional.id)
        }
      }
    } catch (error) {
      console.error('Error updating booking:', error)
    }
  }

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-50'
      case 'cancelled': return 'text-red-600 bg-red-50'
      case 'completed': return 'text-blue-600 bg-blue-50'
      case 'no-show': return 'text-gray-600 bg-gray-50'
      default: return 'text-yellow-600 bg-yellow-50'
    }
  }

  const getStatusText = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed': return 'Confirmado'
      case 'cancelled': return 'Cancelado'
      case 'completed': return 'Concluído'
      case 'no-show': return 'Não compareceu'
      default: return 'Pendente'
    }
  }

  const todayBookings = bookings.filter(b => b.date === format(new Date(), 'yyyy-MM-dd'))
  const upcomingBookings = bookings.filter(b => b.date > format(new Date(), 'yyyy-MM-dd'))
  const pendingBookings = bookings.filter(b => b.status === 'pending')

  if (!professional) return null

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold">Painel Admin</h1>
                <span className="text-gray-500">|</span>
                <span className="text-gray-700">{professional.name}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Agendamentos Hoje</p>
                  <p className="text-2xl font-semibold">{todayBookings.length}</p>
                </div>
                <Calendar className="w-8 h-8 text-rose-gold" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Próximos</p>
                  <p className="text-2xl font-semibold">{upcomingBookings.length}</p>
                </div>
                <Clock className="w-8 h-8 text-deep-purple" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Confirmados</p>
                  <p className="text-2xl font-semibold">
                    {bookings.filter(b => b.status === 'confirmed').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pendentes</p>
                  <p className="text-2xl font-semibold">
                    {bookings.filter(b => b.status === 'pending').length}
                  </p>
                </div>
                <AlertCircle className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="today" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="today">Hoje</TabsTrigger>
              <TabsTrigger value="upcoming">Próximos</TabsTrigger>
              <TabsTrigger value="calendar">Calendário</TabsTrigger>
              <TabsTrigger value="availability">Disponibilidade</TabsTrigger>
              <TabsTrigger value="settings">Configurações</TabsTrigger>
            </TabsList>

            {/* Today Tab */}
            <TabsContent value="today" className="space-y-4">
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Agenda de Hoje - {format(new Date(), "d 'de' MMMM", { locale: ptBR })}
                  </h2>
                </div>
                <div className="p-6">
                  {loading ? (
                    <p className="text-gray-500">Carregando...</p>
                  ) : todayBookings.length === 0 ? (
                    <p className="text-gray-500">Nenhum agendamento para hoje.</p>
                  ) : (
                    <div className="space-y-4">
                      {todayBookings
                        .sort((a, b) => a.startTime.localeCompare(b.startTime))
                        .map((booking) => {
                          const service = professional.servicesOffered.find(s => s.id === booking.serviceId)
                          return (
                            <BookingCard
                              key={booking.id}
                              booking={booking}
                              service={service}
                              onStatusUpdate={updateBookingStatus}
                            />
                          )
                        })}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Upcoming Tab */}
            <TabsContent value="upcoming" className="space-y-4">
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Próximos Agendamentos
                  </h2>
                </div>
                <div className="p-6">
                  {upcomingBookings.length === 0 ? (
                    <p className="text-gray-500">Nenhum agendamento futuro.</p>
                  ) : (
                    <div className="space-y-4">
                      {upcomingBookings
                        .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))
                        .map((booking) => {
                          const service = professional.servicesOffered.find(s => s.id === booking.serviceId)
                          return (
                            <BookingCard
                              key={booking.id}
                              booking={booking}
                              service={service}
                              onStatusUpdate={updateBookingStatus}
                              showDate
                            />
                          )
                        })}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Calendar Tab */}
            <TabsContent value="calendar" className="space-y-4">
              <CalendarView bookings={bookings} professional={professional} />
            </TabsContent>

            {/* Availability Tab */}
            <TabsContent value="availability" className="space-y-4">
              <AvailabilityManager professional={professional} />
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-4">
              <SettingsView professional={professional} />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </AuthGuard>
  )
}

// Booking Card Component
function BookingCard({ 
  booking, 
  service, 
  onStatusUpdate,
  showDate = false
}: { 
  booking: Booking
  service?: any
  onStatusUpdate: (id: string, status: Booking['status']) => void
  showDate?: boolean
}) {
  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-50'
      case 'cancelled': return 'text-red-600 bg-red-50'
      case 'completed': return 'text-blue-600 bg-blue-50'
      case 'no-show': return 'text-gray-600 bg-gray-50'
      default: return 'text-yellow-600 bg-yellow-50'
    }
  }

  const getStatusText = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed': return 'Confirmado'
      case 'cancelled': return 'Cancelado'
      case 'completed': return 'Concluído'
      case 'no-show': return 'Não compareceu'
      default: return 'Pendente'
    }
  }

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-2">
            {showDate && (
              <span className="text-sm text-gray-600">
                {format(parseISO(booking.date), "dd/MM")}
              </span>
            )}
            <span className="text-lg font-medium">
              {booking.startTime} - {booking.endTime}
            </span>
            <span className={cn(
              'px-2 py-1 rounded text-xs font-medium',
              getStatusColor(booking.status)
            )}>
              {getStatusText(booking.status)}
            </span>
          </div>
          <p className="font-medium">{booking.customerName}</p>
          <p className="text-sm text-gray-600">
            {service?.name} • {booking.customerPhone}
          </p>
          {booking.notes && (
            <p className="text-sm text-gray-500 mt-1">
              Obs: {booking.notes}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {booking.status === 'pending' && (
            <>
              <Button
                size="sm"
                variant="outline"
                className="text-green-600"
                onClick={() => onStatusUpdate(booking.id, 'confirmed')}
              >
                <CheckCircle className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-red-600"
                onClick={() => onStatusUpdate(booking.id, 'cancelled')}
              >
                <XCircle className="w-4 h-4" />
              </Button>
            </>
          )}
          {booking.status === 'confirmed' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onStatusUpdate(booking.id, 'completed')}
            >
              Concluir
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

// Calendar View Component
function CalendarView({ bookings, professional }: { bookings: Booking[], professional: Professional }) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getBookingsForDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return bookings.filter(b => b.date === dateStr)
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
          </h2>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentMonth(addDays(currentMonth, -30))}
            >
              Anterior
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentMonth(addDays(currentMonth, 30))}
            >
              Próximo
            </Button>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-7 gap-1">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
              {day}
            </div>
          ))}
          {monthDays.map(day => {
            const dayBookings = getBookingsForDay(day)
            const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
            
            return (
              <div
                key={day.toString()}
                className={cn(
                  "min-h-[80px] p-2 border rounded",
                  isToday && "bg-blue-50 border-blue-300"
                )}
              >
                <div className="text-sm font-medium mb-1">
                  {format(day, 'd')}
                </div>
                {dayBookings.length > 0 && (
                  <div className="space-y-1">
                    {dayBookings.slice(0, 2).map(booking => (
                      <div
                        key={booking.id}
                        className="text-xs p-1 rounded bg-gray-100"
                      >
                        {booking.startTime}
                      </div>
                    ))}
                    {dayBookings.length > 2 && (
                      <div className="text-xs text-gray-500">
                        +{dayBookings.length - 2} mais
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Settings View Component
function SettingsView({ professional }: { professional: Professional }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Configurações da Agenda
        </h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Horários de Trabalho</h3>
            <div className="space-y-2">
              {Object.entries(professional.workingHours).map(([day, hours]) => (
                <div key={day} className="flex items-center justify-between py-2 border-b">
                  <span className="capitalize">{day}</span>
                  <span className="text-sm">
                    {hours ? `${hours.start} - ${hours.end}` : 'Fechado'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Serviços Oferecidos</h3>
            <div className="space-y-2">
              {professional.servicesOffered.map(service => (
                <div key={service.id} className="flex items-center justify-between py-2 border-b">
                  <div>
                    <p className="font-medium">{service.name}</p>
                    <p className="text-sm text-gray-600">{service.duration} minutos</p>
                  </div>
                  <span className="font-medium">R$ {service.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-800">
            Para alterar horários ou serviços, entre em contato com a administração.
          </p>
        </div>
      </div>
    </div>
  )
}