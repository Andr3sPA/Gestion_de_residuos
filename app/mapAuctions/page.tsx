"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AMap } from "@/components/map/ClientOnlyMap";
import { Loader2 } from "lucide-react";
import { DatePicker } from "@/components/input/DatePicker";
import { InfoTooltip } from "@/components/ui/info";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { AuctionsByPos } from "../api/auctions/listByPos/route";

export default function MapAuctions() {
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 3600 * 1000),
    to: new Date(),
  });
  const [filteredPurchases, setFilteredPurchases] = useState<AuctionsByPos>([]);
  const auctions = useQuery<AuctionsByPos>({
    queryKey: ["auctionsByPos"],
    queryFn: () =>
      axios.get("/api/auctions/listByPos").then((res) => {
        return res.data.auctions;
      }),
  });

  useEffect(() => {
    if (!auctions.isSuccess) return;

    const filtered: AuctionsByPos = [];
    for (let p of auctions.data) {
      const filteredWastes = p.auctions.filter(
        (w) =>
          new Date(w.createdAt) > dateRange.from &&
          new Date(w.createdAt) < dateRange.to,
      );
      if (filteredWastes.length > 0) {
        filtered.push({ pos: p.pos, auctions: filteredWastes });
      }
    }

    setFilteredPurchases(filtered);
  }, [auctions.isSuccess, auctions.data, dateRange]);

  return auctions.isLoading ? (
    <div className="flex justify-center items-center w-full p-8 max-h-screen">
      <Loader2 className="animate-spin" />
    </div>
  ) : (
    <div className="w-full h-full flex flex-col justify-center">
      <div
        className={cn(
          "flex flex-col gap-2 justify-center fixed left-0 top-36 z-10 m-2",
          "opacity-60 hover:opacity-100 transition-opacity duration-300 ease-out",
        )}
      >
        <DatePicker
          classname={cn(
            "w-[64px] hover:w-full",
            "transition-width duration-300 ease-out",
          )}
          selected={dateRange.from}
          onSelect={(date) =>
            setDateRange((range) => ({ ...range, from: date }))
          }
        />
        <DatePicker
          classname={cn(
            "w-[64px] hover:w-full",
            "transition-width duration-300 ease-out",
          )}
          selected={dateRange.to}
          onSelect={(date) => setDateRange((range) => ({ ...range, to: date }))}
        />
        <InfoTooltip
          className="scale-75 w-fit"
          tooltip="Filtra aquí por rango de fechas"
          side="right"
        />
      </div>
      <InfoTooltip
        className="absolute right-0 top-16 m-4"
        tooltip="Aquí puedes explorar las subastas según su ubicación."
        side="left"
      />
      <AMap marks={filteredPurchases} />
    </div>
  );
}
