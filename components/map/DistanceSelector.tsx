"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LatLng, LatLngTuple, PosAnimation } from "leaflet";
import { MapPinned } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Slider } from "../ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { LMap } from "./ClientOnlyMap";

export interface PosDist {
  pos: LatLngTuple | null;
  distance: number;
}

export function DistanceSelector({
  onSearch,
}: {
  onSearch?: (posAndDist: PosDist) => void;
}) {
  const [open, setOpen] = useState(false);
  const [posAndDistance, setPosAndDistance] = useState<PosDist>({
    pos: null,
    distance: 1,
  });

  const debounce = (func: (args: any) => void, delay: number) => {
    let timeout: NodeJS.Timeout;
    return (args: any) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(args), delay);
    };
  };
  const updateDistance = debounce(
    (d) => setPosAndDistance((prev) => ({ ...prev, distance: d })),
    100,
  );

  const askForGeoAndUpdatePos = () => {
    if (navigator.geolocation) {
      navigator.permissions.query({ name: "geolocation" }).then((res) => {
        if (res.state === "granted") {
          navigator.geolocation.getCurrentPosition((pos) => {
            const posLatLng: LatLngTuple = [
              pos.coords.latitude,
              pos.coords.longitude,
            ];
            setPosAndDistance((prev) => ({ ...prev, pos: posLatLng }));
          });
        }
      });
    }
  };

  return (
    <div className="flex justify-end w-1/2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant={"outline"}
                    onClick={() => {
                      if (!posAndDistance.pos) {
                        askForGeoAndUpdatePos();
                      }
                    }}
                  >
                    <MapPinned />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Buscar por distancia</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </PopoverTrigger>
        <PopoverContent
          side={"bottom"}
          className="w-fit h-fit flex flex-col items-center"
        >
          <div className="w-full mx-2 mt-2">
            <span className="text-md text-nowrap">Distancia máxima:</span>
            <div className="flex gap-2 p-2">
              <Slider
                defaultValue={[posAndDistance.distance]}
                min={1}
                max={40}
                step={0.5}
                className="scale-90 w-3/4 p-2 mx-2 hover:cursor-grab"
                onValueChange={(val) => {
                  updateDistance(val[0]);
                }}
              />
              <span className=" text-nowrap">{posAndDistance.distance} Km</span>
            </div>
          </div>
          <Separator className="my-2" />
          <LMap
            size="sm"
            mark={posAndDistance.pos || undefined}
            onMarkChange={(pos) =>
              setPosAndDistance((prev) => ({
                ...prev,
                pos: [pos.lat, pos.lng],
              }))
            }
            markerRadius={posAndDistance.distance * 1000}
          />
          <Separator className="my-2" />
          <Button
            onClick={() => {
              onSearch && onSearch(posAndDistance);
              setOpen(false);
            }}
          >
            Buscar
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
}
