"use client";
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
import { ToastAction } from "@/components/ui/toast";
import axios from "axios";
import React from "react";

const FormSchema = z.object({
  id: z.number(),
  units: z
    .number()
    .positive({ message: "Las unidades deben ser un número positivo." }),
});

interface WasteFormProps {
  waste_id: number;
}

export function WasteEditForm({ waste_id }: WasteFormProps) {

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      id: waste_id,
      units: 0,
    },
  });

  function onSubmit(formData: z.infer<typeof FormSchema>) {
    axios
      .post("/api/wastes/edit", {
        wasteId: formData.id,
        units: formData.units,
      })
      .then((response) => {
        toast({
          title: "Residuo editado con éxito",
          description: response.data.message,
        });
      })
      .catch((error) => {
        toast({
          title: "Error al editar el residuo",
          description: error.response?.data?.error || error.message,
          action: <ToastAction altText="Retry">Retry</ToastAction>,
        });
      });
  }

  return (
    
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>ID</FormLabel>
                <FormControl>
                  <Input type="number" {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="units"
            render={({ field }) => (
              <FormItem className="flex flex-col">
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
        </div>

        <div className="flex justify-evenly">
          <Button type="submit" className="w-2/5">
            Editar Residuo
          </Button>
        </div>
      </form>
    </Form>
  );
}
