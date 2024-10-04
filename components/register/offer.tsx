"use client";
import axios from "axios";
import { useState } from "react";
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
import { Separator } from "@radix-ui/react-dropdown-menu";

const FormSchema = z.object({
  waste_id: z.number(),
  price: z.number().positive({ message: "El precio debe ser un número positivo." }),
  units: z.number().positive({ message: "Las unidades deben ser un número positivo." }),
  pickupLatitude: z.number(),
  pickupLongitude: z.number(),
});

interface OfferFormProps {
  wasteId: number; // Prop que recibe el waste_id
  onCancel?: () => void
}

export function OfferForm({ wasteId, onCancel }: OfferFormProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      waste_id: wasteId,
      price: 0,
      units: 0,
      pickupLatitude: 0,
      pickupLongitude: 0,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("Datos antes de enviar:", data);

    axios.post('/api/offer/register', data)
      .then((response) => {
        console.log(response);
        toast({ title: "Oferta registrada con éxito.", description: response.data.message });
      })
      .catch((error) => {
        console.error(error);
        toast({ title: "Error al registrar la oferta.", description: error.message });
      });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="waste_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Waste ID</FormLabel>
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
          {/*TODO: change to map pick */}
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
        </div>
        <div className="flex justify-evenly">
          {onCancel &&
            <Button onClick={onCancel} variant={"secondary"}>Regresar</Button>
          }
          <Button type="submit">Registrar Oferta</Button>
        </div>
      </form>
    </Form>
  );
}
