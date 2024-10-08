"use client";
import { Combobox } from "@/components/Combobox";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import * as React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
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

interface OfferFormProps {
  onCancel?: () => void;
}

export function WasteWithAuctionForm({ onCancel }: OfferFormProps) {
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

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("Datos antes de enviar:", data);

    axios
      .post("/api/wastes/registerWithOffer", data)
      .then((response) => {
        console.log(response);
        toast({
          title: "Subasta registrada con éxito.",
          description: response.data.message,
        });
      })
      .catch((error) => {
        console.error(error);
        toast({
          title: "Error al registrar la subasta.",
          description: error.message,
        });
      });
  }
  if (isLoadingWasteTypes || isLoadingUnitTypes) {
    return <p>Cargando...</p>; // Mostrar un estado de carga
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger>Subastar</AlertDialogTrigger>
      <AlertDialogContent className="max-w-max">
        <AlertDialogHeader>
          <AlertDialogTitle>Crear subasta</AlertDialogTitle>
          <AlertDialogDescription />
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
                    <FormItem>
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
                    <FormItem>
                      <FormLabel>Precio</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Precio de la oferta"
                          {...field}
                          value={field.value}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
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
                    <FormItem>
                      <FormLabel>Unidades</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Número de unidades"
                          {...field}
                          value={field.value}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
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
                      <FormLabel>Ubicación de Recogida</FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger>
                            <Button type="button"></Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[400px] h -[200px]"></PopoverContent>
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
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <Button type="submit">Registrar Subasta</Button>
                </AlertDialogFooter>
              </div>
            </form>
          </Form>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}
