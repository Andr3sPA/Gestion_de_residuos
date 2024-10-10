"use client";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Loader2Icon } from "lucide-react"; // Importa el ícono de carga
import { format } from "date-fns";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSession } from "next-auth/react";
import { ToastAction } from "@/components/ui/toast"

// Esquema de validación con Zod
const FormSchema = z.object({
  waste_id: z.number(),
  price: z.number().positive({ message: "El precio debe ser un número positivo." }),
  units: z.number().positive({ message: "Las unidades deben ser un número positivo." }),
  pickupLatitude: z.number(),
  pickupLongitude: z.number(),
  expiresAt: z.date({ required_error: "La fecha de expiración es obligatoria." }),
  contact: z.string().min(1, { message: "El campo de contacto es obligatorio." }),
  conditions: z.string().min(1, { message: "Las condiciones son obligatorias." }), // Nuevo campo de condiciones
});

interface OfferFormProps {
  wasteId: number; // Prop que recibe el waste_id
  onCancel?: () => void;
}

export function AuctionForm({ wasteId, onCancel }: OfferFormProps) {
  const { data, status } = useSession()
  const [isLoading, setIsLoading] = useState(false); // Estado para controlar la carga
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      waste_id: wasteId,
      price: 0,
      units: 0,
      pickupLatitude: 0,
      pickupLongitude: 0,
      expiresAt: new Date(),
      contact: status === "authenticated" && data?.user?.email ? data.user.email : "",
      conditions: '', // Valor por defecto para condiciones
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true); // Inicia la carga
    console.log("Datos antes de enviar:", data);

    axios.post('/api/auctions/register', data)
      .then((response) => {
        toast({
          description: response.data.message, // Asegúrate de usar el mensaje de la respuesta
        })  
      })
      .catch((error) => {
        toast({  variant: "destructive", title: "Error al registrar la oferta.", description: error.message });
      })
      .finally(() => {
        setIsLoading(false); // Finaliza la carga
      });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-2 gap-6">
          {/* Waste ID */}
          <FormField
            control={form.control}
            name="waste_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID del residuo</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="ID de residuo"
                    {...field}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Precio */}
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Precio de la oferta"
                    {...field}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Fecha de Expiración */}
          <FormField
            control={form.control}
            name="expiresAt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de Expiración</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className="w-full pl-3 text-left font-normal"
                      >
                        {field.value ? format(field.value, "PPP") : "Selecciona una fecha"}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        if (date) {
                          field.onChange(date); // Asegúrate de que esto sea un objeto Date
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Unidades */}
          <FormField
            control={form.control}
            name="units"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unidades</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Número de unidades"
                    {...field}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Latitud de Recogida */}
          <FormField
            control={form.control}
            name="pickupLatitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Latitud de Recogida</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Latitud"
                    {...field}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Longitud de Recogida */}
          <FormField
            control={form.control}
            name="pickupLongitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Longitud de Recogida</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Longitud"
                    {...field}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Campo de Contacto */}
          <FormField
            control={form.control}
            name="contact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contacto</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Ingrese su contacto"
                    {...field}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Campo de Condiciones */}
          <FormField
            control={form.control}
            name="conditions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Condiciones</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Ingrese las condiciones"
                    {...field}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-evenly">
          {onCancel && (
            <Button variant="secondary" className="w-2/5" onClick={onCancel} type="button">
              Cancelar
            </Button>
          )}

          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2Icon className="animate-spin" /> : "Registrar Oferta"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
