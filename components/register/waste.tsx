"use client";

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
} from "@/components/ui/select"; // Importar el componente Select
import { Combobox } from "@/components/ui/combobox";

const FormSchema = z.object({
  description: z.string().min(1, { message: "La descripción es requerida." }),
  units: z.number().positive({ message: "Las unidades deben ser un número positivo." }),
  unitType: z.string().min(1, { message: "El tipo de unidad es requerido." }),
  wasteType: z.string().min(1, { message: "El tipo de residuo es requerido." }),
  category: z.string().min(1, { message: "La categoría es requerida." }), // Cambiado de status a category
});

interface WasteFormProps {
  onCancel?: () => void;
}

export function WasteForm({ onCancel }: WasteFormProps) {
  const [wasteTypes, setWasteTypes] = useState<{ value: string; label: string }[]>([]);
  const [unitTypes, setUnitTypes] = useState<{ value: string; label: string }[]>([]);
  const [selectedWasteType, setSelectedWasteType] = useState("");
  const [selectedUnitType, setSelectedUnitType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(""); // Nuevo estado para categoría

  useEffect(() => {
    axios.get('/api/wastes/register')
      .then((response) => {
        setWasteTypes(response.data.wasteTypes.map(type => ({ value: type.name, label: type.name })));
        setUnitTypes(response.data.unitTypes.map(type => ({ value: type.name, label: type.name })));
      })
      .catch((error) => {
        console.error("Error fetching waste and unit types:", error);
      });
  }, []);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      description: "",
      units: 0,
      unitType: "",
      wasteType: "",
      category: "", // Cambiado de status a category
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("Datos antes de enviar:", data);

    // Mapeo del valor del estado a la categoría
    data.category = selectedCategory;

    axios.post('/api/wastes/register', data)
      .then((response) => {
        console.log(response);
        toast({ title: "Residuo registrado con éxito.", description: response.data.message });
      })
      .catch((error) => {
        console.error(error);
        toast({ title: "Error al registrar el residuo.", description: error.message });
      });
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
                <FormLabel>Tipo de Residuo</FormLabel>
                <Combobox
                  placeholder="Tipo de Residuo"
                  list={wasteTypes}
                  value={selectedWasteType}
                  setValue={(option) => {
                    setSelectedWasteType(option);
                    field.onChange(option);
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
                <FormLabel>Tipo de Unidad</FormLabel>
                <Combobox
                  placeholder="Tipo de Unidad"
                  list={unitTypes}
                  value={selectedUnitType}
                  setValue={(option) => {
                    setSelectedUnitType(option);
                    field.onChange(option);
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
                <Select onValueChange={(value) => {
                  setSelectedCategory(value);  // Actualiza la categoría seleccionada
                  field.onChange(value);  // Notifica a react-hook-form
                }}>
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
          <Button type="submit" className="w-2/5">Registrar Residuo</Button>
          {onCancel && (
            <Button variant="secondary" className="w-2/5" onClick={onCancel} type="button">
              Cancelar
            </Button>
          )}

        </div>
      </form>
    </Form>
  );
}
