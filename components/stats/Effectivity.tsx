"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { Label, Pie, PieChart } from "recharts";
import { Auction, AuctionStatus } from "@prisma/client";
import { useEffect, useMemo, useState } from "react";
import { DatePicker } from "../input/DatePicker";
import { Loader2 } from "lucide-react";

interface AuctionsCount {
  name: AuctionStatus;
  count: number;
  fill: string;
}

export function Effectivity() {
  const [range, setRange] = useState({
    from: new Date(Date.now() - 365 * 24 * 3600 * 1000),
    to: new Date(),
  });
  const auctions = useQuery<Auction[]>({
    queryKey: ["allAuctions"],
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    queryFn: () =>
      axios.get("/api/auctions/listAll").then((res) => {
        return res.data.auctions;
      }),
  });
  const [filteredData, setFilteredData] = useState<AuctionsCount[]>([]);

  useEffect(() => {
    if (!auctions.isSuccess) return;
    const counts: AuctionsCount[] = Object.keys(AuctionStatus).map(
      (key, i) => ({
        name: key as AuctionStatus,
        count: auctions.data.filter((a) => {
          return (
            a.status === key &&
            new Date(a.createdAt) >= range.from &&
            new Date(a.createdAt) <= range.to
          );
        }).length,
        fill: `var(--chart-${(i % 5) + 1})`,
      }),
    );
    setFilteredData(counts);
  }, [range, auctions.isSuccess, auctions.data]);

  return (
    <div className="w-fit h-full flex flex-col justify-around items-center overflow-auto">
      <div className="flex flex-wrap justify-center gap-4 overflow-auto">
        <DatePicker
          label="Desde"
          selected={range.from}
          onSelect={(date) => setRange((prev) => ({ ...prev, from: date }))}
        />
        <DatePicker
          label="Hasta"
          selected={range.to}
          onSelect={(date) => setRange((prev) => ({ ...prev, to: date }))}
        />
      </div>
      {auctions.isLoading ? (
        <div className="min-h-32 flex flex-col justify-center">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <PieGraph data={filteredData} />
      )}
    </div>
  );
}

const config: ChartConfig = {
  available: {
    label: "Abiertas",
  },
  closed: {
    label: "Cerradas",
  },
  sold: {
    label: "Vendidas",
  },
  expired: {
    label: "Expiradas",
  },
};

function PieGraph({ data }: { data: AuctionsCount[] | undefined }) {
  const total = useMemo(() => {
    if (!data) return 0;
    return data.map((c) => c.count).reduce((c1, c2) => c1 + c2, 0);
  }, [data]);

  return total === 0 ? (
    <div className="flex flex-col justify-center min-h-44 m-2 px-4 rounded-md">
      <span className="font-light">
        No hay subastas en el rango seleccionado
      </span>
    </div>
  ) : (
    <ChartContainer
      className="flex-grow sm:mt-8 m-2 mt-6 w-[80%] min-h-36 hover:bg-accent transition-colors duration-500 rounded-md"
      config={config}
    >
      <PieChart>
        <ChartTooltip
          content={
            <ChartTooltipContent
              indicator="line"
              labelKey="count"
              nameKey="name"
            />
          }
        />
        <ChartLegend content={<ChartLegendContent className="flex-wrap" />} />
        <Pie
          innerRadius={"70%"}
          outerRadius={"105%"}
          paddingAngle={3}
          data={data}
          dataKey={"count"}
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    textAnchor="middle"
                    dominantBaseline={"middle"}
                    x={viewBox.cx}
                    y={viewBox.cy}
                    className="flex flex-col"
                  >
                    <tspan className="font-bold text-lg">
                      {total.toLocaleString()}
                    </tspan>
                    <tspan
                      className="font-light"
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 16}
                    >
                      Subastas
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
