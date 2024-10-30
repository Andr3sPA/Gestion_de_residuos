"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { useEffect, useState } from "react";
import { CartesianGrid, Label, Line, LineChart, XAxis, YAxis } from "recharts";
import { format, toDate } from "date-fns";
import { DatePicker } from "../input/DatePicker";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { EyeIcon, Loader2 } from "lucide-react";
import axios from "axios";
import { Purchase } from "../PurchaseList";

interface StatPerDate {
  dateMilli: number;
  purchases: number;
  totalPrice: number;
}

export function PurchasesChart() {
  const [range, setRange] = useState({
    // from: new Date().setFullYear(new Date().getFullYear() - 1),
    from: new Date(Date.now() - 15 * 24 * 3600 * 1000),
    to: new Date(),
  });
  const purchases = useQuery({
    queryKey: ["purchasesGraph"],
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    // queryFn: () => {
    //   const test = new Array(20).fill(undefined).map((_, i) => {
    //     return {
    //       id: i,
    //       createdAt: new Date(
    //         Date.now() + 30 * 24 * 3600 * 1000 * Math.sin(i * i),
    //       ).getTime(),
    //       finalPrice: Math.exp(Math.sin(i) + Math.cos(-2 * i)) * 1000,
    //     };
    //   });
    //
    //   return test.sort((a, b) => a.createdAt - b.createdAt);
    // },
    queryFn: () =>
      axios.get("/api/purchases/listAll").then((res) => {
        console.log(res.data.purchases);
        return res.data.purchases as Purchase[];
      }),
  });
  const [processedData, setProcessedData] = useState<StatPerDate[]>([]);
  const [valueToShow, setValueToShow] = useState<"purchases" | "totalPrice">(
    "purchases",
  );

  useEffect(() => {
    if (purchases.isSuccess) {
      const result: StatPerDate[] = [];
      purchases.data
        .filter(
          (p) =>
            new Date(p.createdAt) >= range.from &&
            new Date(p.createdAt) <= range.to,
        )
        .reduce(
          (
            res: {
              [k: string]: StatPerDate;
            },
            p,
          ) => {
            const date = format(new Date(p.createdAt), "P");
            if (!res[date]) {
              res[date] = {
                dateMilli: toDate(date).getTime(),
                purchases: 0,
                totalPrice: 0,
              };
              result.push(res[date]);
            }
            res[date].purchases += 1;
            res[date].totalPrice += p.finalPrice;
            return res;
          },
          {},
        );

      setProcessedData(result);
    }
  }, [purchases.data, purchases.isSuccess, range]);

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-2 gap-4 pb-4">
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
      <Select
        value={valueToShow}
        onValueChange={(v: "purchases" | "totalPrice") => setValueToShow(v)}
      >
        <SelectTrigger className="w-min text-nowrap scale-90">
          <EyeIcon className="mr-2" />
          {valueToShow === "totalPrice"
            ? "Sumas de precios"
            : "Conteo de ventas"}
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="totalPrice">Suma de precios</SelectItem>
          <SelectItem value="purchases">Conteo de ventas</SelectItem>
        </SelectContent>
      </Select>
      {purchases.isLoading ? (
        <div className="min-h-32 flex flex-col justify-center">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <LineGraph data={processedData} dataKey={valueToShow} />
      )}
    </div>
  );
}

function LineGraph({
  data,
  dataKey,
}: {
  data: StatPerDate[] | undefined;
  dataKey: "purchases" | "totalPrice";
}) {
  const config: ChartConfig = {
    totalPrice: {
      label: "Precio total",
      color: "hsl(var(--chart-1))",
    },
    dateMilli: {
      label: "Fecha",
    },
    purchases: {
      label: "Ventas",
    },
  };

  if (!data)
    return (
      <div className="min-h-32">
        <Loader2 className="animate-spin" />
      </div>
    );
  return data.length === 0 ? (
    <div className="w-min min-h-32 flex flex-col justify-center">
      <span className="text-nowrap">No se encontraron datos</span>
    </div>
  ) : (
    <ChartContainer config={config} className="w-min min-h-52 mt-2">
      <LineChart data={data}>
        <ChartTooltip
          content={
            <ChartTooltipContent
              labelFormatter={(_, payload) => {
                const date = new Date(payload[0].payload.dateMilli);
                return format(date, "PPP");
              }}
            />
          }
        />
        <XAxis
          padding={{ left: 10, right: 10 }}
          type="number"
          domain={["minData", "maxData"]}
          dataKey={"dateMilli"}
          tickLine={false}
          tickFormatter={(v) => {
            return format(new Date(v), "d MMM");
          }}
        />
        <YAxis
          label={
            <Label angle={270} position={"insideLeft"} offset={5}>
              {dataKey === "totalPrice" ? "COP$" : ""}
            </Label>
          }
          allowDecimals={false}
          dataKey={dataKey}
        />
        <CartesianGrid />
        <Line dataKey={dataKey} />
      </LineChart>
    </ChartContainer>
  );
}
