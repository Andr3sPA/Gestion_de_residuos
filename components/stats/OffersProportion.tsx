"use client";

import { Offer } from "@prisma/client";
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

export function OffersProportion() {
  const offers = useQuery({
    queryKey: ["offersProportion"],
    queryFn: () =>
      axios.get("/api/offers/listAll").then((res) => {
        const offers = res.data.offers as Offer[];
        const accepted = offers.filter((o) => o.status === "accepted").length;
        const rest = offers.length - accepted;
        return [
          {
            proportion: "accepted",
            count: accepted,
            fill: "hsl(var(--chart-1))",
          },
          { proportion: "rest", count: rest, fill: "hsl(var(--chart-2))" },
        ];
      }),
  });

  const config: ChartConfig = {
    accepted: {
      label: "Aceptadas",
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
        <tspan className="font-semibold" x={x} y={y - 8}>
          {offers.isSuccess &&
            (
              offers.data[0].count /
              (offers.data[0].count + offers.data[1].count)
            ).toFixed(2)}
        </tspan>
        <tspan className="font-light text-xs" x={x} y={y + 8}>
          Aceptadas/Total
        </tspan>
      </text>
    </svg>
  );

  return (
    <div className="w-full">
      {offers.isLoading && <Loader2 className="animate-spin" />}
      {offers.isSuccess && (
        <div className="flex flex-wrap justify-between gap-4">
          <ChartContainer config={config} className="min-h-44 max-w-44">
            <PieChart
              margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
              className="hover:bg-accent transition-colors duration-500 rounded-md"
            >
              <Pie data={offers.data} dataKey={"count"} label />
              <ChartTooltip
                content={<ChartTooltipContent hideLabel nameKey="proportion" />}
              />
            </PieChart>
          </ChartContainer>
          <div className="flex flex-col gap-1 text-sm">
            <div className="flex justify-between gap-2">
              <span>Total de ofertas</span>
              <Badge variant={"outline"}>
                {offers.data[0].count + offers.data[1].count}
              </Badge>
            </div>
            <div className="flex justify-between gap-2">
              <span>Aceptadas</span>
              <Badge className="bg-chart-1">{offers.data[0].count}</Badge>
            </div>
            <div className="flex flex-col items-center mt-2">{proportion}</div>
          </div>
        </div>
      )}
    </div>
  );
}
