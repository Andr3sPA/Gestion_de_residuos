import { ReactNode, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export function DatePicker({
  label,
  dir = "vertical",
  selected,
  onSelect,
}: {
  label?: string;
  dir?: "horizontal" | "vertical";
  selected?: Date;
  onSelect?: (date: Date) => void;
}) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(selected);
  const [open, setOpen] = useState(false);

  const popover = (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn({ "font-light": selectedDate === undefined })}
        >
          {selectedDate ? format(selectedDate, "PPP") : "--/--/----"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
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
