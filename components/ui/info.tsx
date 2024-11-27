import { InfoIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export function InfoTooltip({
  tooltip,
  side = "top",
  className,
}: {
  tooltip: string;
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(" z-10", className)}
        onMouseLeave={() => setOpen(false)}
        onMouseEnter={() => setOpen(true)}
        asChild
      >
        <div className="p-2 bg-white rounded-full hover:cursor-pointer hover:bg-accent">
          <InfoIcon className="stroke-primary stroke-2" />
        </div>
      </PopoverTrigger>
      <PopoverContent side={side} className="max-w-[60vw] p-3 w-fit">
        <p className="text-wrap font-normal text-sm">{tooltip}</p>
      </PopoverContent>
    </Popover>
  );
}
