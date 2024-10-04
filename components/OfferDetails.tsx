import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { CounterOfferForm } from "./register/counterOffer";
import { useState } from "react";

export function OfferDetails({ offerInfo }: { offerInfo: any }) {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Oferta número 4568</DialogTitle>
        <DialogDescription>
          Hecha el{" "}
          {new Date(offerInfo.createdAt).toLocaleDateString("es-LA", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
          })}
        </DialogDescription>
      </DialogHeader>
      <div className="grid grid-cols-2">
        <div>
          <span className="text-xs font-light">Descripción</span>
          <Separator />
          <span className="text-lg font-semibold">{offerInfo.waste.description}</span>
        </div>
        <div>
          <span className="text-xs font-light">Precio</span>
          <Separator />
          <span className="text-lg font-semibold">${offerInfo.offerPrice}</span>
        </div>
      </div>

      <DialogFooter>
        <div className="flex flex-col justify-end w-full h-full">
          <span className="m-1 text-sm font-light">
            Expira el{" "}
            {new Date(offerInfo.waste.expirationDate).toLocaleDateString("es-LA", {
              year: "numeric",
              month: "numeric",
              day: "numeric",
            })}
          </span>
        </div>

        {/* Popover para mostrar el formulario de contraoferta */}
        <Popover>
          <PopoverTrigger asChild>
            <Button>Realizar contraoferta</Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-4">
            {/* Formulario CounterOfferForm dentro del Popover */}
            <CounterOfferForm offerId={offerInfo.id} />
          </PopoverContent>
        </Popover>
      </DialogFooter>
    </DialogContent>
  );
}