"use client";
import axios from "axios";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, MapIcon, Loader2Icon } from "lucide-react"; // Importa el ícono de carga
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useQuery } from "@tanstack/react-query";
import { Combobox } from "@/components/Combobox";
import { useSession } from "next-auth/react";
import { SimpleCard } from "@/components/SimpleCard";
import LMap from "@/components/map/ClientOnlyMap";
import { LatLng } from "leaflet";
import { useRouter } from "next/navigation";

// Esquema de validación con Zod
const FormSchema = z.object({
  price: z
    .number()
    .positive({ message: "El precio debe ser un número positivo." }),
  units: z
    .number()
    .positive({ message: "Las unidades deben ser un número positivo." }),
  pickupLatitude: z.number(),
  pickupLongitude: z.number(),
  expiresAt: z.date({
    required_error: "La fecha de expiración es obligatoria.",
  }),
  contact: z
    .string()
    .min(1, { message: "El campo de contacto es obligatorio." }),
  conditions: z
    .string()
    .min(1, { message: "Las condiciones son obligatorias." }), // Nuevo campo de condiciones
  description: z.string().min(1, { message: "La descripción es requerida." }),
  unitType: z.string().min(1, { message: "El tipo de unidad es requerido." }),
  wasteType: z.string().min(1, { message: "El tipo de residuo es requerido." }),
  category: z.string().min(1, { message: "La categoría es requerida." }),
});

export function WasteWithAuctionForm() {
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

  const { data, status } = useSession();
  const [isLoading, setIsLoading] = useState(false); // Estado para controlar la carga
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      description: "",
      unitType: "",
      wasteType: "",
      category: "",
      price: 0,
      units: 0,
      pickupLatitude: 0,
      pickupLongitude: 0,
      expiresAt: new Date(),
      contact:
        status === "authenticated" && data?.user?.email ? data.user.email : "",
      conditions: "", // Valor por defecto para condiciones
    },
  });

  const router = useRouter();

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true); // Inicia la carga
    console.log("Datos antes de enviar:", data);

    axios
      .post("/api/wastes/registerWithOffer", data)
      .then((response) => {
        console.log(response);
        toast({
          description: response.data.message, // Solo descripción
        });
      })
      .catch((error) => {
        console.error(error);
        toast({
          variant: "destructive",
          title: "Error al registrar la subasta.",
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

  const latLngValue = () => {
    const { pickupLatitude, pickupLongitude } = form.getValues();
    return `${pickupLatitude.toFixed(2)}, ${pickupLongitude.toFixed(2)}`;
  };

  return (
    <SimpleCard className="m-4" title="Crea una nueva subasta">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
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
            {/* Select para la categoría */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Categoría</FormLabel>
                  <Select onValueChange={(value) => field.onChange(value)}>
                    {/* Aumenta el ancho o usa w-full para ocupar todo el espacio disponible */}
                    <SelectTrigger className="w-full">
                      {" "}
                      {/* Puedes ajustar este valor según sea necesario */}
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

            {/* Precio */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Precio</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="text-right"
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
                <FormItem className="flex flex-col">
                  <FormLabel>Fecha de Expiración</FormLabel>
                  <Popover modal={true}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className="w-full pl-3 text-left font-normal"
                        >
                          {field.value
                            ? format(field.value, "PPP")
                            : "Selecciona una fecha"}
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
                <FormItem className="flex flex-col">
                  <FormLabel>Unidades</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Número de unidades"
                      className="text-right"
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
            {/* <FormField */}
            {/*   control={form.control} */}
            {/*   name="pickupLongitude" */}
            {/*   render={({ field }) => ( */}
            {/*     <FormItem> */}
            {/*       <FormLabel>Longitud de Recogida</FormLabel> */}
            {/*       <FormControl> */}
            {/*         <Input */}
            {/*           type="number" */}
            {/*           placeholder="Longitud" */}
            {/*           {...field} */}
            {/*           value={field.value} */}
            {/*           onChange={(e) => */}
            {/*             field.onChange(e.target.valueAsNumber) */}
            {/*           } */}
            {/*         /> */}
            {/*       </FormControl> */}
            {/*       <FormMessage /> */}
            {/*     </FormItem> */}
            {/*   )} */}
            {/* /> */}
            {/* Campo de Contacto */}
            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem className="flex flex-col">
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
                <FormItem className="flex flex-col">
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

            {/* Ubicación de Recogida */}
            <FormField
              control={form.control}
              name="pickupLatitude"
              render={({ field }) => (
                <FormItem className="flex flex-col col-start-2">
                  <FormLabel>Ubicación de Recogida</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <div className="flex gap-2">
                          <Input value={latLngValue()} disabled></Input>
                          <Button type="button" variant={"outline"}>
                            <MapIcon />
                          </Button>
                        </div>
                      </PopoverTrigger>
                      <PopoverContent side={"bottom"} className="w-fit h-fit">
                        <LMap
                          size="sm"
                          onMarkChange={(pos) => {
                            form.setValue("pickupLatitude", pos.lat);
                            form.setValue("pickupLongitude", pos.lng);
                          }}
                        />
                      </PopoverContent>
                    </Popover>

                    {/* <Input */}
                    {/*   type="number" */}
                    {/*   placeholder="Latitud" */}
                    {/*   {...field} */}
                    {/*   value={field.value} */}
                    {/*   onChange={(e) => */}
                    {/*     field.onChange(e.target.valueAsNumber) */}
                    {/*   } */}
                    {/* /> */}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-evenly pt-4">
            <Button
              type="button"
              variant={"secondary"}
              onClick={() => router.back()}
            >
              Regresar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2Icon className="animate-spin" /> : "Registrar Subasta"}
            </Button>
          </div>
        </form>
      </Form>
    </SimpleCard>
  );
}
