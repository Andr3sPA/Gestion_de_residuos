import { MapIcon } from "lucide-react";
import { LMap } from "../map/ClientOnlyMap";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { LatLng } from "leaflet";
import { LatLngTuple } from "leaflet";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export function MapPopover({
  markedPos,
  onMarkChange,
  enableEdit = true,
}: {
  markedPos?: LatLngTuple;
  onMarkChange?: (pos: LatLng) => void;
  enableEdit?: boolean;
}) {
  const [addr, setAddr] = useState("");

  return (
    <div className="flex gap-2">
      <Popover>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Input contentEditable={false} value={addr}></Input>
            </TooltipTrigger>
            <TooltipContent className="w-64">{addr}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <PopoverTrigger asChild>
          <Button type="button" variant={"outline"}>
            <MapIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent side={"bottom"} className="w-fit h-fit">
          <LMap
            size="sm"
            mark={markedPos}
            disabled={!enableEdit}
            onMarkChange={onMarkChange}
            onReverseGeocoding={(r) => {
              if (!r) {
                setAddr("");
                return;
              }

              setAddr(r.properties?.display_name);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
