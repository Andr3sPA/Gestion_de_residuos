"use client";
import { useQuery } from "@tanstack/react-query";
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
import { Loader2Icon } from "lucide-react"; // Importa el ícono de carga
import { useState } from "react"; // Importa useState

const FormSchema = z.object({
  description: z.string().min(1, { message: "La descripción es requerida." }),
  units: z
    .number()
    .positive({ message: "Las unidades deben ser un número positivo." }),
  unitType: z.string().min(1, { message: "El tipo de unidad es requerido." }),
  wasteType: z.string().min(1, { message: "El tipo de residuo es requerido." }),
  category: z.string().min(1, { message: "La categoría es requerida." }),
});

interface WasteFormProps {
  onCancel?: () => void;
}

export function WasteForm({ onCancel }: WasteFormProps) {
  const { data: wasteTypesData, isLoading: isLoadingWasteTypes } = useQuery({
    queryKey: ["wasteTypes"],
    queryFn: () =>
      axios.get("/api/wastes/register").then((res) =>
        res.data.wasteTypes.map((type: any) => ({
          id: type.name,
          label: type.name,
        })),
      ),
  });

  const { data: unitTypesData, isLoading: isLoadingUnitTypes } = useQuery({
    queryKey: ["unitTypes"],
    queryFn: () =>
      axios.get("/api/wastes/register").then((res) =>
        res.data.unitTypes.map((type: any) => ({
          id: type.name,
          label: type.name,
        })),
      ),
  });

  const [isLoading, setIsLoading] = useState(false); // Estado para controlar la carga
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
    setIsLoading(true); // Inicia la carga
    axios
      .post("/api/wastes/register", data)
      .then((response) => {
        toast({
          description: response.data.message, // Solo descripción
        });
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Error al registrar el residuo.",
          description: error.message,
        });
      })
      .finally(() => {
        setIsLoading(false); // Finaliza la carga
      });
  }

  if (isLoadingWasteTypes || isLoadingUnitTypes) {
    return <p>Cargando...</p>; // Mostrar un estado de carga
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-2 gap-6">
          {/* Campo de Descripción */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="flex flex-col">
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

          {/* Combobox para Waste Type */}
          <FormField
            control={form.control}
            name="wasteType"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel htmlFor="wasteType">Tipo de Residuo</FormLabel>
                <Combobox
                  list={wasteTypesData ?? []}
                  onSelect={(option) => {
                    form.setValue("wasteType", option ? option.id : "");
                  }}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Unidades */}
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

          {/* Combobox para Unit Type */}
          <FormField
            control={form.control}
            name="unitType"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel htmlFor="unitType">Tipo de Unidad</FormLabel>
                <Combobox
                  list={unitTypesData ?? []}
                  onSelect={(option) => {
                    form.setValue("unitType", option ? option.id : "");
                  }}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Select para la categoría */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem className="flex flex-col">
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
          <Button type="submit" className="w-2/5" disabled={isLoading}>
            {isLoading ? <Loader2Icon className="animate-spin" /> : "Registrar Residuo"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
