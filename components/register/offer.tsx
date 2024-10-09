"use client";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { Loader2Icon } from "lucide-react"; // Importa el ícono de carga
import { useState } from "react"; // Importa useState

const FormSchema = z.object({
  auctionId: z.number(), // Cambiamos auctionId para que sea opcional
  price: z
    .number()
    .positive({ message: "El precio debe ser un número positivo." }),
  contact: z
    .string()
    .min(1, { message: "El campo de contacto es obligatorio." }), // Campo de contacto
});

interface OfferFormProps {
  auctionId?: number; // Hacemos que auctionId sea opcional
}

export function OfferForm({ auctionId }: OfferFormProps) {
  const { data, status } = useSession();
  const [isLoading, setIsLoading] = useState(false); // Estado para controlar la carga
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      auctionId: auctionId || undefined, // Si no hay auctionId, el campo es editable
      price: 0,
      contact: data.user.email || "", // Valor por defecto para el campo de contacto
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true); // Inicia la carga
    console.log("Datos antes de enviar:", data);

    // Convertir el precio a número
    const payload = {
      ...data,
      price: Number(data.price), // Asegúrate de que sea un número
    };

    axios
      .post("/api/offers/register", payload)
      .then((response) => {
        toast({
          description: response.data.message,
        });
      })
      .catch((error) => {
        console.error(error);
        toast({
          variant: "destructive",
          title: "Error al registrar la oferta.",
          description: error.message,
        });
      })
      .finally(() => {
        setIsLoading(false); // Finaliza la carga
      });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="auctionId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Offer ID</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="ID de la oferta"
                  {...field}
                  disabled={!!auctionId} // Si auctionId fue pasado, el campo será no editable
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Precio</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Precio"
                  {...field}
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Loader2Icon className="animate-spin" /> : "Registrar oferta"}
        </Button>
      </form>
    </Form>
  );
}
