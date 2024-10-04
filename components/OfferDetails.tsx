import { Separator } from "@radix-ui/react-dropdown-menu";
import { Button } from "./ui/button";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { off } from "process";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CounterOfferForm } from "./register/counterOffer";
export function OfferDetails({ offerInfo }: { offerInfo: any }) {

  return <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle>Oferta número {offerInfo.id}</DialogTitle>
      <DialogDescription>
        Hecha el{" "}{new Date(offerInfo.createdAt)
          .toLocaleDateString("es-LA", {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
          })
        }
      </DialogDescription>
    </DialogHeader>
    <div className="grid grid-cols-2">
      <div>
        <span className="text-xs font-light">Descripción</span>
        <Separator />
        <span className="text-lg font-semibold">{offerInfo.waste.description}</span>
        <Separator className="h-1" />
        <span className="text-xs font-light">Tipo</span>
        <Separator />
        <span className="text-lg font-semibold">{offerInfo.waste.wasteType.wasteType}</span>
      </div>
      <div className="">
        <span className="text-xs font-light">Precio</span>
        <Separator />
        <span className="text-lg font-semibold">${offerInfo.offerPrice}</span>
        <Separator className="h-1" />
        <span className="text-xs font-light">Cantidad</span>
        <Separator />
        <span className="text-lg font-semibold">
          {offerInfo.units}{" "}
          <span className="text-sm font-bold">{offerInfo.waste.unitType.unitName}</span>
        </span>
      </div>
      <div>
        <span className="text-xs font-light">Ofrecido por</span>
        <Separator />
        <span className="text-lg font-semibold">{offerInfo.companySeller.name}</span>
      </div>
      <div>
        <span className="text-xs font-light">Ubicación</span>
        <Separator />
        <span className="text-lg font-semibold">
          <Button variant={"outline"} className="text-xs">Ver mapa</Button>
        </span>
      </div>
    </div>
    <DialogFooter>
      <div className="flex flex-col justify-end w-full h-full">
        <span className="m-1 text-sm font-light">Expira el
          {" "}
          {new Date(offerInfo.waste.expirationDate)
            .toLocaleDateString("es-LA", {
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
            })}</span>
        </div>
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
}