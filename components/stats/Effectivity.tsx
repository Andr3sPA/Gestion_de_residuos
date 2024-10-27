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
import { Label, Legend, Pie, PieChart } from "recharts";
import { Auction, AuctionStatus } from "@prisma/client";
import { useEffect, useMemo, useState } from "react";
import { SimpleCard } from "../common/SimpleCard";
import { DatePicker } from "../input/DatePicker";
import { Loader2 } from "lucide-react";

interface AuctionsCount {
  name: AuctionStatus;
  count: number;
  fill: string;
}

export function Effectivity() {
  const [range, setRange] = useState({ from: new Date(0), to: new Date() });
  const auctions = useQuery<Auction[]>({
    queryKey: ["stats"],
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    queryFn: () =>
      axios.get("/api/auctions/listAll").then((res) => {
        return res.data.auctions;
      }),
  });
  const [data, setData] = useState<AuctionsCount[]>([]);

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
        fill: `hsl(var(--chart-${(i % 5) + 1}))`,
      }),
    );
    setData(counts);
  }, [range, auctions.isSuccess, auctions.data]);

  return (
    <SimpleCard>
      <div className="w-fit flex flex-col items-center p-2">
        <div className="grid sm:grid-cols-2 sm:grid-rows-1 grid-rows-2 gap-4">
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
        <PieGraph data={data} />
      </div>
    </SimpleCard>
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
    <div className="flex flex-col justify-center min-h-60 m-2 px-4 rounded-md">
      {data ? (
        <span className="font-light">
          No hay subastas en el rango seleccionado
        </span>
      ) : (
        <Loader2 className="animate-spin" />
      )}
    </div>
  ) : (
    <ChartContainer
      className="sm:w-min sm:mt-2 m-2 mt-6 w-3/5 min-h-60 hover:bg-accent transition-colors duration-500 rounded-md"
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
          innerRadius={50}
          outerRadius={80}
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
