import { Auction, AuctionStatus, Offer } from "@prisma/client";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { Pie, PieChart } from "recharts";
import { Badge } from "../ui/badge";

export function Proportion({ data }: { data: Auction[] | Offer[] }) {
  const isAuction = (arg: Auction | Offer): arg is Auction => {
    return Object.values(AuctionStatus as any).includes(arg.status);
  };

  let proportions;
  if (data.length > 0) {
    if (isAuction(data[0])) {
      const sold = data.filter((a) => a.status === "sold").length;
      proportions = [
        { proportion: "sold", count: sold, fill: "hsl(var(--chart-1))" },
      ];
    } else {
      const accepted = data.filter((o) => o.status === "accepted").length;
      proportions = [
        {
          proportion: "accepted",
          count: accepted,
          fill: "hsl(var(--chart-1))",
        },
      ];
    }

    const rest = data.length - proportions[0].count;
    proportions.push({
      proportion: "rest",
      count: rest,
      fill: "hsl(var(--chart-2))",
    });
  }

  const config: ChartConfig = {
    accepted: {
      label: "Aceptadas",
    },
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
          {proportions
            ? (
                proportions[0].count /
                (proportions[0].count + proportions[1].count)
              ).toFixed(2)
            : 0}
        </tspan>
        <tspan className="font-light text-xs" x={x} y={y + 8}>
          Vendidas/Total
        </tspan>
      </text>
    </svg>
  );

  return (
    <div className="w-full">
      {
        <div className="flex flex-wrap w-fit justify-around gap-4">
          <ChartContainer config={config} className="min-h-44 max-w-44">
            <PieChart
              margin={{ left: 15, right: 15, top: 15, bottom: 15 }}
              className="hover:bg-accent transition-colors duration-500 rounded-md"
            >
              <Pie
                data={proportions}
                dataKey={"count"}
                nameKey={"proportion"}
                label
              />
              <ChartTooltip
                content={<ChartTooltipContent hideLabel nameKey="proportion" />}
              />
            </PieChart>
          </ChartContainer>
          <div className="flex flex-col gap-1 text-sm mb-2">
            <div className="flex justify-between gap-2">
              <span>Total de subastas</span>
              <Badge variant={"outline"}>
                {proportions ? proportions[0].count + proportions[1].count : 0}
              </Badge>
            </div>
            <div className="flex justify-between gap-2">
              <span>Vendidas</span>
              <Badge className="bg-chart-1">
                {proportions ? proportions[0].count : 0}
              </Badge>
            </div>
            <div className="flex flex-col items-center mt-2">{proportion}</div>
          </div>
        </div>
      }
    </div>
  );
}
