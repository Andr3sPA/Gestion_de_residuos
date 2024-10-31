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
  const { status } = useSession();

  if (status === "unauthenticated") return <div>Nothing</div>;
  if (status === "loading")
    return (
      <div>
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <div className="flex flex-col w-full gap-6 justify-start">
      <div className="flex flex-wrap justify-center">
        <SimpleCard
          title="Estado de las subastas"
          titleCenter
          className="px-0 py-0.5"
        >
          <Effectivity />
        </SimpleCard>
        <SimpleCard
          title="Histórico de ventas"
          titleCenter
          className="px-0 py-0.5"
        >
          <PurchasesChart />
        </SimpleCard>
        <SimpleCard
          title="Proporción de subastas vendidas y ofertas aceptadas"
          titleCenter
          className="pt-0 mt-0"
        >
          <div className="flex flex-col">
            <AuctionsProportion />
            <Separator className="m-2" />
            <OffersProportion />
          </div>
        </SimpleCard>
      </div>
    </div>
  );
}
