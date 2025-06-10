'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'
import { Clock, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

interface TimeSlot {
  start: string
  end: string
}

interface Break {
  start: string
  end: string
}

interface TimeSlotEditorProps {
  isOpen: boolean
  onClose: () => void
  date: Date
  professionalName: string
  defaultHours?: {
    start: string
    end: string
    breaks?: Break[]
  }
  onSave: (hours: { start: string; end: string; breaks?: Break[] }) => void
}

export function TimeSlotEditor({
  isOpen,
  onClose,
  date,
  professionalName,
  defaultHours,
  onSave
}: TimeSlotEditorProps) {
  const [startTime, setStartTime] = useState(defaultHours?.start || '09:00')
  const [endTime, setEndTime] = useState(defaultHours?.end || '18:00')
  const [breaks, setBreaks] = useState<Break[]>(defaultHours?.breaks || [])
  const [newBreakStart, setNewBreakStart] = useState('12:00')
  const [newBreakEnd, setNewBreakEnd] = useState('13:00')

  const handleAddBreak = () => {
    if (newBreakStart && newBreakEnd && newBreakStart < newBreakEnd) {
      setBreaks([...breaks, { start: newBreakStart, end: newBreakEnd }])
      setNewBreakStart('12:00')
      setNewBreakEnd('13:00')
    }
  }

  const handleRemoveBreak = (index: number) => {
    setBreaks(breaks.filter((_, i) => i !== index))
  }

  const handleSave = () => {
    onSave({
      start: startTime,
      end: endTime,
      breaks: breaks.length > 0 ? breaks : undefined
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Configurar Horários
          </DialogTitle>
          <DialogDescription>
            Defina os horários de trabalho para {professionalName} em{' '}
            {format(date, "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Working Hours */}
          <div className="space-y-4">
            <h4 className="font-medium">Horário de Trabalho</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start">Início</Label>
                <Input
                  id="start"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="end">Término</Label>
                <Input
                  id="end"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Breaks */}
          <div className="space-y-4">
            <h4 className="font-medium">Intervalos</h4>
            
            {breaks.length > 0 && (
              <div className="space-y-2">
                {breaks.map((breakTime, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <span className="text-sm">
                      {breakTime.start} - {breakTime.end}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveBreak(index)}
                      className="ml-auto text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Label htmlFor="breakStart">Início do Intervalo</Label>
                <Input
                  id="breakStart"
                  type="time"
                  value={newBreakStart}
                  onChange={(e) => setNewBreakStart(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="breakEnd">Fim do Intervalo</Label>
                <Input
                  id="breakEnd"
                  type="time"
                  value={newBreakEnd}
                  onChange={(e) => setNewBreakEnd(e.target.value)}
                />
              </div>
              <Button
                size="sm"
                onClick={handleAddBreak}
                className="flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Adicionar
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Salvar Horários
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}