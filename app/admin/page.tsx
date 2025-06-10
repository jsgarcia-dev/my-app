'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Lock, User } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { getAllProfessionals } from '@/lib/data/professionals'
import { validatePin } from '@/lib/data/professional-auth'
import { setAuthToken } from '@/lib/utils/auth'

const formSchema = z.object({
  professionalId: z.string().min(1, 'Selecione um profissional'),
  pin: z.string().min(4, 'PIN deve ter 4 dígitos').max(4, 'PIN deve ter 4 dígitos'),
})

export default function AdminLoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [professionals, setProfessionals] = useState<any[]>([])

  // Carregar profissionais ao montar o componente
  useEffect(() => {
    getAllProfessionals().then(setProfessionals)
  }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      professionalId: '',
      pin: '',
    },
  })

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setError('')
    setIsLoading(true)

    try {
      // Validate PIN (agora é assíncrono)
      const isValid = await validatePin(values.professionalId, values.pin)
      if (!isValid) {
        setError('PIN incorreto ou conta bloqueada')
        setIsLoading(false)
        return
      }

      // Store auth in session storage with new auth token
      setAuthToken(values.professionalId, values.pin)
      sessionStorage.setItem('adminProfessionalId', values.professionalId)
      sessionStorage.setItem('adminAuth', 'true')

      // Redirect to dashboard
      router.push(`/admin/dashboard`)
    } catch (error) {
      console.error('Login error:', error)
      setError('Erro ao fazer login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-rose-gold to-deep-purple rounded-full mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Painel Admin</h1>
            <p className="text-gray-600 mt-2">Acesse sua agenda profissional</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="professionalId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profissional</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione seu perfil" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {professionals.map((prof) => (
                          <SelectItem key={prof.id} value={prof.id}>
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              {prof.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PIN de Acesso</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Digite seu PIN de 4 dígitos"
                        maxLength={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Esqueceu seu PIN? Entre em contato com a administração.
            </p>
          </div>
        </div>

        {/* Demo PINs - Remove in production */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800 font-medium mb-2">PINs de Demonstração:</p>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>Ana Silva: 1234</li>
            <li>Beatriz Santos: 2345</li>
            <li>Carlos Oliveira: 3456</li>
            <li>Diana Costa: 4567</li>
          </ul>
        </div>
      </div>
    </div>
  )
}