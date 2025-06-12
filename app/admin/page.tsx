'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Lock, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { getAllProfessionals } from '@/lib/data/professionals';
import { validatePin } from '@/lib/data/professional-auth';
import { setAuthToken } from '@/lib/utils/auth';

// Definição do nome do administrador para fácil manutenção
const ADMIN_USER_NAME = 'Administrador';

const formSchema = z.object({
  professionalId: z.string().min(1, 'Selecione um profissional'),
  pin: z.string().min(4, 'A senha é necessária'),
});

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [selectedProfessionalName, setSelectedProfessionalName] = useState('');

  // Carregar profissionais ao montar o componente
  useEffect(() => {
    getAllProfessionals().then(setProfessionals);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      professionalId: '',
      pin: '',
    },
  });

  // Observar a mudança do ID do profissional para atualizar o nome
  const professionalId = form.watch('professionalId');
  useEffect(() => {
    const selected = professionals.find((p) => p.id === professionalId);
    setSelectedProfessionalName(selected?.name || '');
  }, [professionalId, professionals]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setError('');
    setIsLoading(true);

    try {
      // Validate PIN (agora é assíncrono)
      const isValid = await validatePin(values.professionalId, values.pin);
      if (!isValid) {
        setError('PIN incorreto ou conta bloqueada');
        setIsLoading(false);
        return;
      }

      // Store auth in session storage with new auth token
      setAuthToken(values.professionalId, values.pin);
      sessionStorage.setItem('adminProfessionalId', values.professionalId);
      sessionStorage.setItem('adminAuth', 'true');

      // Redirect to dashboard
      router.push(`/admin/dashboard`);
    } catch (error) {
      console.error('Login error:', error);
      setError('Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="rounded-lg bg-white p-8 shadow-xl">
          <div className="mb-8 text-center">
            <div className="from-rose-gold to-deep-purple mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Painel Admin</h1>
            <p className="mt-2 text-gray-600">Acesse sua agenda profissional</p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="professionalId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profissional</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        const selected = professionals.find(
                          (p) => p.id === value
                        );
                        setSelectedProfessionalName(selected?.name || '');
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione seu perfil" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {professionals.map((prof) => (
                          <SelectItem key={prof.id} value={prof.id}>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
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
                    <FormLabel>
                      {selectedProfessionalName === ADMIN_USER_NAME
                        ? 'Senha de Acesso'
                        : 'PIN de Acesso'}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={
                          selectedProfessionalName === ADMIN_USER_NAME
                            ? 'Digite sua senha'
                            : 'Digite seu PIN de 4 dígitos'
                        }
                        maxLength={
                          selectedProfessionalName === ADMIN_USER_NAME
                            ? undefined
                            : 4
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
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
        <div className="mt-4 rounded-lg bg-blue-50 p-4">
          <p className="mb-2 text-sm font-medium text-blue-800">
            PINs de Demonstração:
          </p>
          <ul className="space-y-1 text-xs text-blue-700">
            <li>Ana Silva: 1234</li>
            <li>Beatriz Santos: 2345</li>
            <li>Carlos Oliveira: 3456</li>
            <li>Diana Costa: 4567</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
