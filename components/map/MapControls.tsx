import { Marker, useMapEvents } from "react-leaflet";
import { useEffect, useRef, useState } from "react";
import L, { LatLngExpression, LatLngLiteral } from "leaflet";

import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import Geocoder, { geocoders } from "leaflet-control-geocoder";
import {
  GeocodingCallback,
  GeocodingResult,
  Nominatim,
} from "leaflet-control-geocoder/dist/geocoders";
import { useGeocoder } from "@/hooks/use-geocoder";

export function MapSearchAndMark({
  onMarkChange,
  markedPos,
  onReverseGeocoding,
}: {
  onMarkChange: (latLng: LatLngExpression) => void;
  onReverseGeocoding?: (reversed: GeocodingResult[] | undefined) => void;
  markedPos: LatLngExpression | null;
}) {
  let gcControl = useRef<Geocoder | null>(null);
  const { reverseGeocode } = useGeocoder();

  const map = useMapEvents({
    click: (e) => {
      onMarkChange(e.latlng);
      onReverseGeocoding && reverseGeocode(e.latlng, onReverseGeocoding);
    },
  });

  useEffect(() => {
    if (gcControl.current) return;

    gcControl.current = new Geocoder({
      defaultMarkGeocode: false,
    });

    gcControl.current
      .on("markgeocode", function (e) {
        const bbox = e.geocode.bbox;
        const poly = L.polygon([
          [bbox.getSouthEast().lat, bbox.getSouthEast().lng],
          [bbox.getNorthEast().lat, bbox.getNorthEast().lng],
          [bbox.getNorthWest().lat, bbox.getNorthWest().lng],
          [bbox.getSouthWest().lat, bbox.getSouthWest().lng],
        ]);
        map.fitBounds(poly.getBounds());
        onMarkChange(e.geocode.center);

        onReverseGeocoding &&
          reverseGeocode(e.geocode.center, onReverseGeocoding);
      })
      .addTo(map);
  }, [map, onMarkChange, reverseGeocode]);

  return markedPos ? <Marker position={markedPos} /> : null;
}
