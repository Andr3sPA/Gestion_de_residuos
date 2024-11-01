"use client";

import { Auction } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { Pie, PieChart } from "recharts";
import { Badge } from "../ui/badge";

export function AuctionsProportion() {
  const auctions = useQuery({
    queryKey: ["auctionsProportion"],
    queryFn: () =>
      axios.get("/api/auctions/listAll").then((res) => {
        const auctions = res.data.auctions as Auction[];
        console.log(auctions);
        const sold = auctions.filter((o) => o.status === "sold").length;
        const rest = auctions.length - sold;
        return [
          {
            proportion: "sold",
            count: sold,
            fill: "hsl(var(--chart-1))",
          },
          { proportion: "rest", count: rest, fill: "hsl(var(--chart-2))" },
        ];
      }),
  });

  const config: ChartConfig = {
    sold: {
      label: "Vendidas",
    },
    rest: {
      label: "Otras",
    },
  };

  const r = 50;
  const strokeWidth = 1;
  const [x, y] = [r + 2 * strokeWidth, r + 2 * strokeWidth];
  const proportion = (
    <svg width={2 * r + 4 * strokeWidth} height={2 * r + 4 * strokeWidth}>
      <circle
        cx={x}
        cy={y}
        r={r}
        strokeWidth={strokeWidth}
        className="fill-none stroke-gray-800 shadow-sm shadow-black"
      />
      <text
        textAnchor="middle"
        dominantBaseline="middle"
        x={x}
        y={y}
        className="flex flex-col"
      >
        <tspan className="font-semibold text-lg" x={x} y={y - 8}>
          {auctions.isSuccess &&
            (
              auctions.data[0].count /
              (auctions.data[0].count + auctions.data[1].count)
            ).toFixed(2)}
        </tspan>
        <tspan className="font-light text-xs" x={x} y={y + 8}>
          Vendidas/Total
        </tspan>
      </text>
    </svg>
  );

  return (
    <div className="w-full">
      {auctions.isLoading && <Loader2 className="animate-spin" />}
      {auctions.isSuccess && (
        <div className="flex flex-wrap w-fit justify-around gap-4">
          <ChartContainer config={config} className="min-h-44 max-w-44">
            <PieChart
              margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
              className="hover:bg-accent transition-colors duration-500 rounded-md"
            >
              <Pie data={auctions.data} dataKey={"count"} label />
              <ChartTooltip
                content={<ChartTooltipContent hideLabel nameKey="proportion" />}
              />
            </PieChart>
          </ChartContainer>
          <div className="flex flex-col gap-1 text-sm mb-2">
            <div className="flex justify-between gap-2">
              <span>Total de subastas</span>
              <Badge variant={"outline"}>
                {auctions.data[0].count + auctions.data[1].count}
              </Badge>
            </div>
            <div className="flex justify-between gap-2">
              <span>Vendidas</span>
              <Badge className="bg-chart-1">{auctions.data[0].count}</Badge>
            </div>
            <div className="flex flex-col items-center mt-2">{proportion}</div>
          </div>
        </div>
      )}
    </div>
  );
}
