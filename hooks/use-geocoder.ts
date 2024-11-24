"use client";

import { useState, useEffect, useRef } from "react";
import { LatLngExpression, LatLngLiteral } from "leaflet";
import { GeocodingCallback } from "leaflet-control-geocoder/dist/geocoders";

export function useGeocoder() {
  const geocoder = useRef<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const geocode = (query: string, callback: GeocodingCallback) => {
    geocoder.current?.geocode(query, callback);
  };

  const reverseGeocode = (
    latLng: LatLngExpression,
    callback: GeocodingCallback,
  ) => {
    let literal: LatLngLiteral;
    if ("slice" in latLng) {
      literal = {
        lat: latLng[0],
        lng: latLng[1],
        alt: latLng[2],
      };
    } else {
      literal = latLng;
    }

    geocoder.current?.reverse(literal, 1 << 26, callback);
  };

  useEffect(() => {
    const initializeGeocoder = async () => {
      if (typeof window !== "undefined") {
        const { geocoders } = await import("leaflet-control-geocoder");
        geocoder.current = new geocoders.Nominatim();
        setIsInitialized(true);
      }
    };

    initializeGeocoder();
  }, []);

  return { geocode, reverseGeocode, isInitialized };
}
