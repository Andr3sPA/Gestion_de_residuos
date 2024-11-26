"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { BarChart, Bar, XAxis } from "recharts";
import { Loader2 } from "lucide-react";

export function CO2Chart() {
  const emmissions = useQuery({
    queryKey: ["co2Emmissions"],
    queryFn: () =>
      axios.get("/api/wastes/CO2Avoided").then((res) => {
        const numColors = 5;
        return res.data.map((e: any, i: number) => ({
          ...e,
          fill: `var(--chart-${(i % numColors) + 1})`,
        }));
      }),
  });

  const config: ChartConfig = {
    avoidedCO2: {
      label: "CO2",
    },
  };

  if (emmissions.isLoading)
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <div className="p-2 pt-8 w-full h-full">
      <ChartContainer
        config={config}
        className="min-h-[30vh] w-full h-auto px-4"
      >
        <BarChart data={emmissions.data ?? []}>
          <ChartTooltip content={<ChartTooltipContent units="Kg" />} />
          <XAxis dataKey={"name"} />
          <Bar dataKey={"avoidedCO2"}></Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
}
