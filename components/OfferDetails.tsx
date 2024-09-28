import { Separator } from "@radix-ui/react-dropdown-menu";
import { Button } from "./ui/button";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export function OfferDetails() {

  return <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle>Oferta número 4568</DialogTitle>
      <DialogDescription>
        Hecha el 18-10-2024
      </DialogDescription>
    </DialogHeader>
    <div className="grid grid-cols-2">
      <div>
        <span className="text-xs font-light">Descripción</span>
        <Separator />
        <span className="text-lg font-semibold">Periódicos viejos</span>
        <Separator className="h-1" />
        <span className="text-xs font-light">Tipo</span>
        <Separator />
        <span className="text-lg font-semibold">Papel</span>
      </div>
      <div className="">
        <span className="text-xs font-light">Precio</span>
        <Separator />
        <span className="text-lg font-semibold">$86.000</span>
        <Separator className="h-1" />
        <span className="text-xs font-light">Cantidad</span>
        <Separator />
        <span className="text-lg font-semibold">
          2000{" "}
          <span className="text-sm font-bold">hojas</span>
        </span>
      </div>
      <div>
        <span className="text-xs font-light">Ofrecido por</span>
        <Separator />
        <span className="text-lg font-semibold">Exito</span>
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
        <span className="m-1 text-sm font-light">Expira el 12-01-2025</span>
      </div>
      <Button>Realizar contra oferta</Button>
    </DialogFooter>
  </DialogContent>
}
