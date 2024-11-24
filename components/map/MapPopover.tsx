"use client";

import { MapIcon } from "lucide-react";
import { LMap } from "../map/ClientOnlyMap";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { LatLng, LatLngExpression } from "leaflet";
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useGeocoder } from "@/hooks/use-geocoder";

export function MapPopover({
  markedPos,
  onMarkChange,
  enableEdit = true,
}: {
  markedPos?: LatLngExpression;
  onMarkChange?: (pos: LatLng) => void;
  enableEdit?: boolean;
}) {
  const [addr, setAddr] = useState("");
  const [addrInitialized, setAddrInitialized] = useState(false);
  const { reverseGeocode } = useGeocoder();

  useEffect(() => {
    if (!addrInitialized && markedPos) {
      reverseGeocode(markedPos, (r) => {
        setAddr(r[0].properties?.display_name);
        setAddrInitialized(true);
      });
    }
  }, [reverseGeocode, addrInitialized]);

  return (
    <div className="flex gap-2">
      <Popover>
        <TooltipProvider delayDuration={400}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Input contentEditable={false} disabled value={addr}></Input>
            </TooltipTrigger>
            <TooltipContent
              hidden={addr.length <= 0}
              className="w-64 font-normal"
            >
              {addr}
            </TooltipContent>
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
              if (!enableEdit) return;
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
