"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { PurchasesByPos } from "../api/purchases/listByPos/route";
import { GMap } from "@/components/map/ClientOnlyMap";
import { InfoIcon, Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Dev() {
  const purchases = useQuery<PurchasesByPos>({
    queryKey: ["purchasesSummary"],
    queryFn: () =>
      axios.get("/api/purchases/listByPos").then((res) => {
        return res.data.purchases;
      }),
  });

  return purchases.isLoading ? (
    <div className="flex justify-center items-center w-full p-8 max-h-screen">
      <Loader2 className="animate-spin" />
    </div>
  ) : (
    <div className="w-full h-full">
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger className="absolute right-0 m-4 z-10" asChild>
            <div className="p-2 bg-white rounded-full hover:cursor-help hover:bg-accent">
              <InfoIcon className="stroke-primary stroke-2" />
            </div>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p className="p-1 text-primary">
              Aquí puedes explorar los residuos que han sido vendidos según su
              ubicación.
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <GMap marks={purchases.data ?? []} />
    </div>
  );
}
