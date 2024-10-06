"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Combobox } from "@/components/Combobox";

const FormSchema = z.object({
  description: z.string().min(1, { message: "La descripción es requerida." }),
  units: z.number().positive({ message: "Las unidades deben ser un número positivo." }),
  unitType: z.string().min(1, { message: "El tipo de unidad es requerido." }),
  wasteType: z.string().min(1, { message: "El tipo de residuo es requerido." }),
  category: z.string().min(1, { message: "La categoría es requerida." }),
});

interface WasteFormProps {
  onCancel?: () => void;
}

export function WasteForm({ onCancel }: WasteFormProps) {
  const { data: wasteTypesData, isLoading: isLoadingWasteTypes } = useQuery({
    queryKey: ['wasteTypes'],
    queryFn: () => axios.get("/api/wastes/register").then(res =>
      res.data.wasteTypes.map((type: any) => ({ id: type.name, label: type.name }))
    ),
  });

  const { data: unitTypesData, isLoading: isLoadingUnitTypes } = useQuery({
    queryKey: ['unitTypes'],
    queryFn: () => axios.get("/api/wastes/register").then(res =>
      res.data.unitTypes.map((type: any) => ({ id: type.name, label: type.name }))
    ),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      description: "",
      units: 0,
      unitType: "",
      wasteType: "",
      category: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    axios
      .post("/api/wastes/register", data)
      .then((response) => {
        toast({ title: "Residuo registrado con éxito.", description: response.data.message });
      })
      .catch((error) => {
        toast({ title: "Error al registrar el residuo.", description: error.message });
      });
  }

  if (isLoadingWasteTypes || isLoadingUnitTypes) {
    return <p>Cargando...</p>; // Mostrar un estado de carga
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-2 gap-6">
          {/* Combobox para Waste Type */}
          <FormField
            control={form.control}
            name="wasteType"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="wasteType">Tipo de Residuo</FormLabel>
                <Combobox
                  list={wasteTypesData ?? []}
                  onSelect={(option) => {
                    form.setValue("wasteType", option ? option.id : "")
                    console.log(form.watch("wasteType"))  // Verifica el cambio de valor
                  }}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Combobox para Unit Type */}
          <FormField
            control={form.control}
            name="unitType"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="unitType">Tipo de Unidad</FormLabel>
                <Combobox
                  list={unitTypesData ?? []}
                  onSelect={(option) => {
                    form.setValue("unitType", option ? option.id : "")
                    console.log(form.watch("unitType"))  // Verifica el cambio de valor
                  }}
                />
                <FormMessage />
              </FormItem>
            )}
          />


          {/* Campo de Descripción */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Descripción del residuo"
                    {...field}
                  />
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
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Select para la categoría */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoría</FormLabel>
                <Select onValueChange={(value) => field.onChange(value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Categorías</SelectLabel>
                      <SelectItem value="usable">Usable</SelectItem>
                      <SelectItem value="nonUsable">No usable</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-evenly">
          <Button type="submit" className="w-2/5">
            Registrar Residuo
          </Button>
          {onCancel && (
            <Button
              variant="secondary"
              className="w-2/5"
              onClick={onCancel}
              type="button"
            >
              Cancelar
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
