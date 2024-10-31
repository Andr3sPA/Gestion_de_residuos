import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Separator } from "@radix-ui/react-select";
import { useState } from "react";
import { MapPopover } from "./map/MapPopover";
import { Purchase } from "./PurchaseList";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { PopoverArrow } from "@radix-ui/react-popover";
import { Badge } from "./ui/badge";
const wasteCategoryMap = {
  usable: "Usable",
  nonUsable: "No usable",
};

export function PurchaseDetails({
  purchaseInfo,
  recordType,
}: {
  purchaseInfo: Purchase;
  recordType: string;
}) {
  const [offerOpen, setOfferOpen] = useState(false);

  const counts = [
    ["Subastas realizadas", purchaseInfo.counts.countAuctions],
    ["Subastas vendidas", purchaseInfo.counts.countSales],
    ["Ofertas realizadas", purchaseInfo.counts.countOffers],
    ["Subastas compradas", purchaseInfo.counts.countPurchases],
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded-xl text-xs">Detalles</Button>
      </DialogTrigger>
      <DialogContent
        onPointerDownOutside={(e) => {
          // Desactiva el cierre al hacer clic afuera si offerOpen es verdadero
          offerOpen && e.preventDefault();
        }}
        className="sm:max-w-[425px]"
      >
        <DialogHeader>
          <DialogTitle>Venta número {purchaseInfo.id}</DialogTitle>
          <DialogDescription>
            Hecha el{" "}
            {new Date(purchaseInfo.createdAt).toLocaleDateString("es-LA", {
              year: "numeric",
              month: "numeric",
              day: "numeric",
            })}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <span className="text-xs font-light">Condiciones</span>
            <Separator />
            <span className="text-lg font-semibold">
              {purchaseInfo.auction.conditions &&
              purchaseInfo.auction.conditions.length > 0
                ? purchaseInfo.auction.conditions
                : "Sin condiciones"}
            </span>
          </div>
          <div>
            <span className="text-xs font-light">Tipo de residuo</span>
            <Separator />
            <span className="text-lg font-semibold">
              {purchaseInfo.auction.waste.wasteType.name}
            </span>
          </div>
          <div>
            <span className="text-xs font-light">Categoría del residuo</span>
            <Separator />
            <span className="text-lg font-semibold">
              {wasteCategoryMap[purchaseInfo.auction.waste.category]}
            </span>
          </div>
          <div>
            <span className="text-xs font-light">Cantidad</span>
            <Separator />
            <span className="text-lg font-semibold">
              {purchaseInfo.auction.units}{" "}
              {purchaseInfo.auction.waste.unitType.name}
            </span>
          </div>
          <div>
            <span className="text-xs font-light">Precio</span>
            <Separator />
            <span className="text-lg font-semibold">
              {purchaseInfo.finalPrice}
            </span>
          </div>
          <div>
            <span className="text-xs font-light">Ubicación</span>
            <Separator />
            <MapPopover
              enableEdit={false}
              markedPos={[
                parseFloat(purchaseInfo.auction.pickupLatitude),
                parseFloat(purchaseInfo.auction.pickupLongitude),
              ]}
            />
          </div>
          {/* Información específica según recordType */}
          {recordType === "Ventas" && (
            <>
              <div>
                <span className="text-xs font-light">Comprado por</span>
                <Separator />
                <span className="text-lg font-semibold">
                  {purchaseInfo.offer.companyBuyer.name}
                </span>
              </div>
              <div>
                <span className="text-xs font-light">
                  Descripción de la empresa
                </span>
                <Separator />
                <span className="text-lg font-semibold">
                  {purchaseInfo.offer.companyBuyer.description}
                </span>
              </div>
              <div>
                <span className="text-xs font-light">NIT de la empresa</span>
                <Separator />
                <span className="text-lg font-semibold">
                  {purchaseInfo.offer.companyBuyer.nit}
                </span>
              </div>
              <div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button className="rounded-xl text-xs">
                      Calificaciones del comprador
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="flex flex-col w-fit gap-2 text-sm">
                    <PopoverArrow className="fill-background stroke-accent stroke-2" />
                    {counts.map((c, i) => (
                      <div key={i} className="flex gap-4 justify-between">
                        <span className="text-left">{c[0]}</span>
                        <Badge variant={"secondary"}>
                          <span className="text-right font-semibold">
                            {c[1]}
                          </span>
                        </Badge>
                      </div>
                    ))}
                  </PopoverContent>
                </Popover>
              </div>
            </>
          )}

          {recordType === "Compras" && (
            <>
              <div>
                <span className="text-xs font-light">Subastado por</span>
                <Separator />
                <span className="text-lg font-semibold">
                  {purchaseInfo.auction.companySeller.name}
                </span>
              </div>
              <div>
                <span className="text-xs font-light">
                  Descripción de la empresa
                </span>
                <Separator />
                <span className="text-lg font-semibold">
                  {purchaseInfo.auction.companySeller.description}
                </span>
              </div>
              <div>
                <span className="text-xs font-light">NIT de la empresa</span>
                <Separator />
                <span className="text-lg font-semibold">
                  {purchaseInfo.auction.companySeller.nit}
                </span>
              </div>
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      Calificaciones del vendedor
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>
                      Subastas realizadas {purchaseInfo.counts.countAuctions}
                    </DropdownMenuLabel>
                    <DropdownMenuLabel>
                      Subastas vendidas {purchaseInfo.counts.countSales}
                    </DropdownMenuLabel>
                    <DropdownMenuLabel>
                      Ofertas realizadas {purchaseInfo.counts.countOffers}
                    </DropdownMenuLabel>
                    <DropdownMenuLabel>
                      Subastas compradas {purchaseInfo.counts.countPurchases}
                    </DropdownMenuLabel>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
