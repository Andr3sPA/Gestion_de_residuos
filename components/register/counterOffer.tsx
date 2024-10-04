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

const FormSchema = z.object({
    offer_id: z.number().optional(), // Cambiamos offer_id para que sea opcional
    price: z.number().positive({ message: "El precio debe ser un número positivo." }),
});

interface CounterOfferFormProps {
    offerId?: number; // Hacemos que offerId sea opcional
}

export function CounterOfferForm({ offerId }: CounterOfferFormProps) {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            offer_id: offerId || undefined, // Si no hay offerId, el campo es editable
            price: 0,
        },
    });

    function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log("Datos antes de enviar:", data);

        axios.post('/api/counter_offer/register', data)
            .then((response) => {
                console.log(response);
                toast({ title: "Contraoferta registrada con éxito.", description: response.data.message });
            })
            .catch((error) => {
                console.error(error);
                toast({ title: "Error al registrar la contraoferta.", description: error.message });
            });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="offer_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Offer ID</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="ID de la oferta"
                                    {...field}
                                    value={field.value || ""}
                                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                    disabled={!!offerId} // Si offerId fue pasado, el campo será no editable
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
                                    placeholder="Precio de la contraoferta"
                                    {...field}
                                    value={field.value}
                                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Registrar Contraoferta</Button>
            </form>
        </Form>
    );
}

