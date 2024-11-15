import { InfoIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";
import { cn } from "@/lib/utils";

export function InfoTooltip({
  tooltip,
  side = "top",
  className,
}: {
  tooltip: string;
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
}) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger className={cn(" z-10", className)} asChild>
          <div className="p-2 bg-white rounded-full hover:cursor-help hover:bg-accent">
            <InfoIcon className="stroke-primary stroke-2" />
          </div>
        </TooltipTrigger>
        <TooltipContent side={side}>
          <p className="p-1">{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
