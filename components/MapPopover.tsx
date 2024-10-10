import { MapIcon } from "lucide-react";
import LMap from "./map/ClientOnlyMap";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { LatLng } from "leaflet";
import { LatLngTuple } from "leaflet";

export function MapPopover({
  markedPos,
  onMarkChange,
  enableEdit = true,
}: {
  markedPos?: LatLngTuple;
  onMarkChange?: (pos: LatLng) => void;
  enableEdit?: boolean;
}) {
  console.log(markedPos);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex gap-2">
          <Input
            value={
              markedPos &&
              `${markedPos[0].toFixed(2)}, ${markedPos[1].toFixed(2)}`
            }
            disabled
          ></Input>
          <Button type="button" variant={"outline"}>
            <MapIcon />
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent side={"bottom"} className="w-fit h-fit">
        <LMap
          size="sm"
          mark={markedPos}
          disabled={!enableEdit}
          onMarkChange={onMarkChange}
        />
      </PopoverContent>
    </Popover>
  );
}
