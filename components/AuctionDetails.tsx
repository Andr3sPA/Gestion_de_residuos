import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@radix-ui/react-select";
import { PopoverArrow } from "@radix-ui/react-popover";
import { useEffect, useState } from "react";
import { Auction } from "@/app/manage/auctions/page";
import { MapPopover } from "./map/MapPopover";
import { OfferForm } from "./register/OfferForm";

export function AuctionDetails({
  auctionInfo,
  canOffer = true,
}: {
  auctionInfo: Auction;
  canOffer?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={canOffer ? "default" : "outline"}
          className="rounded-xl text-xs"
        >
          Detalles
        </Button>
      </DialogTrigger>
      <DialogContent
        onPointerDownOutside={(e) => {
          // disable close on click outside
          open && e.preventDefault();
        }}
        className="sm:max-w-[425px]"
      >
        <DialogHeader>
          <DialogTitle>Subasta número {auctionInfo.id}</DialogTitle>
          <DialogDescription>
            Hecha el{" "}
            {new Date(auctionInfo.createdAt).toLocaleDateString("es-LA", {
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
            <span className="text-lg font-semibold">
              {auctionInfo.waste.description}
            </span>
            <Separator className="h-1" />
            <span className="text-xs font-light">Tipo</span>
            <Separator />
            <span className="text-lg font-semibold">
              {auctionInfo.waste.wasteType.name}
            </span>
          </div>
          <div>
            <span className="text-xs font-light">Precio</span>
            <Separator />
            <span className="text-lg font-semibold">
              ${auctionInfo.initialPrice}
            </span>
            <Separator className="h-1" />
            <span className="text-xs font-light">Cantidad</span>
            <Separator />
            <span className="text-lg font-semibold">
              {auctionInfo.units}{" "}
              <span className="text-sm font-bold">
                {auctionInfo.waste.unitType.name}
              </span>
            </span>
          </div>
          <div>
            <span className="text-xs font-light">Ofrecido por</span>
            <Separator />
            <span className="text-lg font-semibold">
              {auctionInfo.companySeller.name}
            </span>
            <span className="text-xs font-light">Estado de la subasta</span>
            <Separator />
            <span className="text-lg font-semibold">
              {auctionInfo.status}
            </span>
          </div>
          <div>
            <span className="text-xs font-light">Ubicación</span>
            <Separator />
            <span className="text-lg font-semibold">
              <MapPopover
                enableEdit={false}
                markedPos={[
                  parseFloat(auctionInfo.pickupLatitude),
                  parseFloat(auctionInfo.pickupLongitude),
                ]}
              />
            </span>
          </div>
          <span className="text-xs font-light">NITr</span>
            <Separator />
            <span className="text-lg font-semibold">
              {auctionInfo.companySeller.nit}
            </span>
        </div>
        <DialogFooter>
          <div className="flex flex-col justify-end w-full h-full">
            <span className="m-1 text-sm font-light">
              Expira el{" "}
              {new Date(auctionInfo.expiresAt).toLocaleDateString("es-LA", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
              })}
            </span>
          </div>
          {canOffer ? (
            <Popover modal={true}>
              <PopoverTrigger asChild>
                <Button
                  onClick={() => {
                    setOpen(true);
                  }}
                >
                  Realizar oferta
                </Button>
              </PopoverTrigger>
              <PopoverContent
                onPointerDownOutside={() => setOpen(false)}
                side="right"
                className="w-full p-4"
              >
                <PopoverArrow className="bg-background" />
                {/* Formulario OfferForm dentro del Popover */}
                <OfferForm auctionId={auctionInfo.id} />
              </PopoverContent>
            </Popover>
          ) : (
            <DialogClose>
              <Button variant={"outline"}>Cerrar </Button>
            </DialogClose>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
