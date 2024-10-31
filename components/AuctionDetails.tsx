import { Button } from "./ui/button";
import {
  Dialog,
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
import { useState } from "react";
import { Auction } from "@/app/manage/auctions/page";
import { MapPopover } from "./map/MapPopover";
import { OfferForm } from "./register/OfferForm";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

export function AuctionDetails({
  auctionInfo,
  canOffer = true,
}: {
  auctionInfo: Auction;
  canOffer?: boolean;
}) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const statusMapping: { [key in Auction["status"]]: string } = {
    available: "Disponible",
    closed: "Cerrada",
    expired: "Ya expiró",
    sold: "Vendida",
  };
  const statusColorMapping: { [key in Auction["status"]]: string } = {
    available: "bg-badge-ok",
    closed: "bg-badge-neutral",
    expired: "bg-badge-error",
    sold: "bg-badge-neutral",
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl text-xs">Detalles</Button>
      </DialogTrigger>
      <DialogContent
        onPointerDownOutside={(e) => {
          // disable close on click outside
          popoverOpen && e.preventDefault();
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
              <span className="text-xs font-semibold">COP$ </span>
              <span>{auctionInfo.initialPrice}</span>
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
            <Badge
              className={cn(
                statusColorMapping[auctionInfo.status],
                "ml-2 w-fit",
              )}
            >
              {statusMapping[auctionInfo.status]}
            </Badge>
          </div>
          {canOffer ? (
            <Popover modal={true}>
              <PopoverTrigger asChild>
                <Button
                  onClick={() => {
                    setPopoverOpen(true);
                  }}
                >
                  Realizar oferta
                </Button>
              </PopoverTrigger>
              <PopoverContent
                onPointerDownOutside={() => setPopoverOpen(false)}
                side="bottom"
                className="w-full p-4"
              >
                <PopoverArrow className="bg-background" />
                {/* Formulario OfferForm dentro del Popover */}
                <OfferForm auctionId={auctionInfo.id} />
              </PopoverContent>
            </Popover>
          ) : (
            <div className="flex items-end">
              <Button variant={"outline"} onClick={() => setOpen(false)}>
                Cerrar
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
