"use client"
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

// Esquema de validación utilizando Zod
const FormSchema = z.object({
  description: z.string().min(1, { message: "La descripción es obligatoria." }),
  units: z.number().positive({ message: "Las unidades deben ser un número positivo." }),
  expirationDate: z.date({ required_error: "La fecha de expiración es obligatoria." }),
  nameWasteType: z.string().min(1, { message: "El tipo de residuo es obligatorio." }),
  nameUnitType: z.string().min(1, { message: "El tipo de unidad es obligatorio." }),
  category: z.enum(["usable", "nonUsable"], { required_error: "La categoría es obligatoria." }),
});

export function WasteForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      description: "",
      units: 0,
      expirationDate: new Date(), // Establece la fecha actual como valor por defecto
      nameWasteType: "",
      nameUnitType: "",
      category: "usable", // Por defecto
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    // Verifica que expirationDate sea un objeto Date
    console.log("Datos antes de enviar:", data);
    
    axios.post('api/waste/register', {
      description: data.description,
      units: data.units,
      expirationDate: data.expirationDate,
      nameWasteType: data.nameWasteType,
      nameUnitType: data.nameUnitType,
      category: data.category,
    })
    .then((response) => {
      console.log(response);
    }, (error) => {
      console.log(error);
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Descripción */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Input placeholder="Descripción del residuo" {...field} />
              </FormControl>
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
                  value={field.value} // Establece un valor por defecto si es null o undefined
                  onChange={(e) => field.onChange(e.target.valueAsNumber)} // Utiliza valueAsNumber para convertir el valor a número
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Fecha de Expiración */}
        <FormField
          control={form.control}
          name="expirationDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Fecha de Expiración</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className="w-[240px] pl-3 text-left font-normal"
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

        {/* Tipo de Residuo */}
        <FormField
          control={form.control}
          name="nameWasteType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Residuo</FormLabel>
              <FormControl>
                <Input placeholder="Tipo de residuo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tipo de Unidad */}
        <FormField
          control={form.control}
          name="nameUnitType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Unidad</FormLabel>
              <FormControl>
                <Input placeholder="Tipo de unidad" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Categoría de Residuo */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoría de Residuo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="usable">Usable</SelectItem>
                  <SelectItem value="nonUsable">No usable</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Botón de Enviar */}
        <Button type="submit">Registrar Residuo</Button>
      </form>
    </Form>
  );
}

