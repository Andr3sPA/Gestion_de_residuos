"use client";

import { SimpleCard } from "@/components/common/SimpleCard";
import { AuctionsProportion } from "@/components/stats/AuctionsProportion";
import { Effectivity } from "@/components/stats/Effectivity";
import { OffersProportion } from "@/components/stats/OffersProportion";
import { PurchasesChart } from "@/components/stats/PurchasesChart";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

export default function Home() {
  const { status, data } = useSession();

  if (status === "unauthenticated") return <div>Nothing</div>;
  if (status === "loading")
    return (
      <div>
        <Loader2 className="animate-spin" />
      </div>
    );

  //FIXME: change mean and organize Porportions
  return (
    <div className="flex flex-col w-full gap-6 justify-start">
      <div className="flex md:px-8 p-2 md:flex-row flex-col justify-center md:items-start items-stretch">
        <div className="flex flex-col flex-grow items-stretch w-auto">
          <SimpleCard title={`Hola!, ${data?.user?.name}`} className="w-auto">
            <div>
              <span>Existen en promedio </span>
              <span className="text-lg font-semibold">5.2 </span>
              <span className="font-semibold text-sm">ofertas </span>
              <span>por </span>
              <span className="font-semibold text-sm">subasta</span>
            </div>
          </SimpleCard>
          <SimpleCard
            title="Histórico de ventas"
            titleCenter
            className="flex-grow h-fit w-auto px-0 py-0.5"
          >
            <PurchasesChart />
          </SimpleCard>
        </div>
        <div className="flex flex-col items-stretch">
          <SimpleCard
            title="Estado de las subastas"
            titleCenter
            className="px-0 py-0.5 w-auto"
          >
            <Effectivity />
          </SimpleCard>
          <SimpleCard
            title="Subastas vendidas y ofertas aceptadas"
            titleCenter
            className="pt-0 mt-0 w-auto"
          >
            <div className="flex flex-col items-center w-auto">
              <AuctionsProportion />
              <Separator className="m-2" />
              <OffersProportion />
            </div>
          </SimpleCard>
        </div>
      </div>
    </div>
  );
}
