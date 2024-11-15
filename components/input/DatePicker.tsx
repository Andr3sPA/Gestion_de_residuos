import { ReactNode, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export function DatePicker({
  label,
  dir = "vertical",
  selected,
  onSelect,
  classname,
  side = "bottom",
}: {
  label?: string;
  dir?: "horizontal" | "vertical";
  selected?: Date;
  onSelect?: (date: Date) => void;
  classname?: string;
  side?: "top" | "right" | "bottom" | "left";
}) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(selected);
  const [open, setOpen] = useState(false);

  const popover = (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            { "font-light": selectedDate === undefined },
            "overflow-x-clip w-min",
            classname,
          )}
        >
          <span className="text-left overflow-x-hidden w-full">
            {selectedDate
              ? format(selectedDate, "PPP", { locale: es })
              : "--/--/----"}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start" side={side}>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => {
            if (date) {
              setSelectedDate(date);
              onSelect && onSelect(date);
              setOpen(false);
            }
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );

  return label ? (
    <div className={`flex ${dir === "vertical" ? "flex-col" : ""} gap-1`}>
      <span className="font-light text-sm">{label}</span>
      {popover}
    </div>
  ) : (
    popover
  );
}
