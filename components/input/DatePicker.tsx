import { ReactNode, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";

export function DatePicker({
  children,
  selected,
  onSelect,
}: {
  children: ReactNode;
  selected?: any;
  onSelect?: any;
}) {
  const [selectedDate, setSelectedDate] = useState<any>(selected ?? null);

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => {
            if (date) {
              setSelectedDate(date);
              onSelect(date);
            }
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
