'use client'

import { useState, useEffect } from 'react'
import { Settings, Plus, Edit2, Trash2, Save, X, Clock, DollarSign, PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { getAuthHeaders } from '@/lib/utils/auth'
import { cn } from '@/lib/utils'

interface Service {
  id: string
  name: string
  category: string
  description: string
  base_duration: number
  base_price: number
}

interface ProfessionalService {
  id?: string
  service_id: string
  custom_duration?: number | null
  custom_price?: number | null
  is_available: boolean
  service?: Service
}

interface ServicesManagerProps {
  professionalId: string
}

export function ServicesManager({ professionalId }: ServicesManagerProps) {
  const [services, setServices] = useState<Service[]>([])
  const [professionalServices, setProfessionalServices] = useState<ProfessionalService[]>([])
  const [loading, setLoading] = useState(true)
  const [editingService, setEditingService] = useState<string | null>(null)
  const [customValues, setCustomValues] = useState<{[key: string]: {duration?: number, price?: number}}>({})
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showCustomServiceDialog, setShowCustomServiceDialog] = useState(false)
  const [availableServices, setAvailableServices] = useState<Service[]>([])
  const [customService, setCustomService] = useState({
    name: '',
    description: '',
    duration: 60,
    price: 0
  })

  useEffect(() => {
    fetchServices()
  }, [professionalId])

  const fetchServices = async () => {
    try {
      setLoading(true)
      
      // Fetch all services
      let allServices: Service[] = []
      const servicesResponse = await fetch('/api/services')
      if (servicesResponse.ok) {
        allServices = await servicesResponse.json()
        setServices(allServices)
      }

      // Fetch professional's services
      const profServicesResponse = await fetch(
        `/api/services/professional?professionalId=${professionalId}`,
        { headers: getAuthHeaders() }
      )
      
      if (profServicesResponse.ok) {
        const profServices = await profServicesResponse.json()
        setProfessionalServices(profServices)
        
        // Initialize custom values
        const values: {[key: string]: {duration?: number, price?: number}} = {}
        profServices.forEach((ps: ProfessionalService) => {
          values[ps.service_id] = {
            duration: ps.custom_duration || undefined,
            price: ps.custom_price || undefined
          }
        })
        setCustomValues(values)
        
        // Filter available services (not yet added)
        const addedServiceIds = new Set(profServices.map((ps: ProfessionalService) => ps.service_id))
        setAvailableServices(allServices.filter((s: Service) => !addedServiceIds.has(s.id)))
      }
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleServiceAvailability = async (serviceId: string, isAvailable: boolean) => {
    try {
      const response = await fetch('/api/services/professional', {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          professionalId,
          serviceId,
          is_available: isAvailable
        })
      })

      if (response.ok) {
        setProfessionalServices(prev => 
          prev.map(ps => ps.service_id === serviceId 
            ? { ...ps, is_available: isAvailable }
            : ps
          )
        )
      }
    } catch (error) {
      console.error('Error toggling service availability:', error)
    }
  }

  const updateServiceValues = async (serviceId: string) => {
    try {
      const values = customValues[serviceId] || {}
      const response = await fetch('/api/services/professional', {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          professionalId,
          serviceId,
          custom_duration: values.duration || null,
          custom_price: values.price || null
        })
      })

      if (response.ok) {
        setEditingService(null)
        await fetchServices() // Refresh data
      }
    } catch (error) {
      console.error('Error updating service values:', error)
    }
  }

  const addService = async (serviceId: string) => {
    try {
      const response = await fetch('/api/services/professional', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          professionalId,
          serviceId,
          is_available: true
        })
      })

      if (response.ok) {
        setShowAddDialog(false)
        await fetchServices() // Refresh data
      }
    } catch (error) {
      console.error('Error adding service:', error)
    }
  }

  const removeService = async (serviceId: string) => {
    if (!confirm('Tem certeza que deseja remover este serviço?')) return

    try {
      const response = await fetch('/api/services/professional', {
        method: 'DELETE',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          professionalId,
          serviceId
        })
      })

      if (response.ok) {
        await fetchServices() // Refresh data
      }
    } catch (error) {
      console.error('Error removing service:', error)
    }
  }

  const createCustomService = async () => {
    try {
      // First create the service
      const createServiceResponse = await fetch('/api/services/custom', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: customService.name,
          description: customService.description,
          category: 'Personalizado',
          base_duration: customService.duration,
          base_price: customService.price,
          professionalId
        })
      })

      if (createServiceResponse.ok) {
        const newService = await createServiceResponse.json()
        
        // Then add it to the professional
        const addResponse = await fetch('/api/services/professional', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            professionalId,
            serviceId: newService.id,
            is_available: true
          })
        })

        if (addResponse.ok) {
          setShowCustomServiceDialog(false)
          setCustomService({ name: '', description: '', duration: 60, price: 0 })
          await fetchServices()
        }
      }
    } catch (error) {
      console.error('Error creating custom service:', error)
    }
  }

  const getServiceDetails = (serviceId: string): Service | undefined => {
    return services.find(s => s.id === serviceId)
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Gerenciar Serviços
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Configure os serviços que você oferece
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowCustomServiceDialog(true)}
            >
              <PlusCircle className="w-4 h-4 mr-1" />
              Criar Personalizado
            </Button>
            <Button
              size="sm"
              onClick={() => setShowAddDialog(true)}
              disabled={availableServices.length === 0}
            >
              <Plus className="w-4 h-4 mr-1" />
              Adicionar Existente
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {professionalServices.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            Nenhum serviço configurado. Clique em "Adicionar Serviço" para começar.
          </p>
        ) : (
          <div className="space-y-4">
            {professionalServices.map((profService) => {
              const service = getServiceDetails(profService.service_id)
              if (!service) return null

              const isEditing = editingService === service.id
              const customDuration = customValues[service.id]?.duration
              const customPrice = customValues[service.id]?.price

              return (
                <div
                  key={service.id}
                  className={cn(
                    "border rounded-lg p-4 transition-all",
                    profService.is_available 
                      ? "border-gray-200 bg-white" 
                      : "border-gray-100 bg-gray-50 opacity-60"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-gray-900">{service.name}</h3>
                        <span className={cn(
                          "text-xs px-2 py-1 rounded",
                          service.category === 'Personalizado' 
                            ? "bg-purple-100 text-purple-700 font-medium" 
                            : "bg-gray-100 text-gray-600"
                        )}>
                          {service.category}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {isEditing ? (
                          <>
                            <div>
                              <Label className="text-xs">Duração (minutos)</Label>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <Input
                                  type="number"
                                  value={customDuration || service.base_duration}
                                  onChange={(e) => setCustomValues(prev => ({
                                    ...prev,
                                    [service.id]: {
                                      ...prev[service.id],
                                      duration: parseInt(e.target.value) || undefined
                                    }
                                  }))}
                                  className="h-8"
                                  min="15"
                                  step="15"
                                />
                              </div>
                            </div>
                            
                            <div>
                              <Label className="text-xs">Valor (R$)</Label>
                              <div className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-gray-400" />
                                <Input
                                  type="number"
                                  value={customPrice || service.base_price}
                                  onChange={(e) => setCustomValues(prev => ({
                                    ...prev,
                                    [service.id]: {
                                      ...prev[service.id],
                                      price: parseFloat(e.target.value) || undefined
                                    }
                                  }))}
                                  className="h-8"
                                  min="0"
                                  step="0.01"
                                />
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span>
                                {customDuration || service.base_duration} minutos
                                {customDuration && (
                                  <span className="text-xs text-gray-500 ml-1">
                                    (padrão: {service.base_duration} min)
                                  </span>
                                )}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-sm">
                              <DollarSign className="w-4 h-4 text-gray-400" />
                              <span>
                                R$ {(customPrice || service.base_price).toFixed(2)}
                                {customPrice && (
                                  <span className="text-xs text-gray-500 ml-1">
                                    (padrão: R$ {service.base_price.toFixed(2)})
                                  </span>
                                )}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      {isEditing ? (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => updateServiceValues(service.id)}
                          >
                            <Save className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingService(null)
                              setCustomValues(prev => ({
                                ...prev,
                                [service.id]: {
                                  duration: profService.custom_duration,
                                  price: profService.custom_price
                                }
                              }))
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingService(service.id)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeService(service.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      
                      <div className="ml-2">
                        <Switch
                          checked={profService.is_available}
                          onCheckedChange={(checked) => 
                            toggleServiceAvailability(service.id, checked)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Add Service Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Serviço</DialogTitle>
            <DialogDescription>
              Selecione um serviço para adicionar ao seu perfil
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {availableServices.map((service) => (
              <div
                key={service.id}
                className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => addService(service.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{service.name}</h4>
                    <p className="text-sm text-gray-600">{service.category}</p>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <p>{service.base_duration} min</p>
                    <p>R$ {service.base_price.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Custom Service Dialog */}
      <Dialog open={showCustomServiceDialog} onOpenChange={setShowCustomServiceDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Criar Serviço Personalizado</DialogTitle>
            <DialogDescription>
              Crie um serviço exclusivo para seu perfil
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="service-name">Nome do Serviço</Label>
              <Input
                id="service-name"
                value={customService.name}
                onChange={(e) => setCustomService(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Corte e Escova"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="service-description">Descrição</Label>
              <Textarea
                id="service-description"
                value={customService.description}
                onChange={(e) => setCustomService(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descreva o serviço oferecido"
                className="mt-1"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="service-duration">Duração (minutos)</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <Input
                    id="service-duration"
                    type="number"
                    value={customService.duration}
                    onChange={(e) => setCustomService(prev => ({ ...prev, duration: parseInt(e.target.value) || 60 }))}
                    min="15"
                    step="15"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="service-price">Valor (R$)</Label>
                <div className="flex items-center gap-2 mt-1">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <Input
                    id="service-price"
                    type="number"
                    value={customService.price}
                    onChange={(e) => setCustomService(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowCustomServiceDialog(false)
              setCustomService({ name: '', description: '', duration: 60, price: 0 })
            }}>
              Cancelar
            </Button>
            <Button 
              onClick={createCustomService}
              disabled={!customService.name || customService.duration <= 0 || customService.price < 0}
            >
              Criar Serviço
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}