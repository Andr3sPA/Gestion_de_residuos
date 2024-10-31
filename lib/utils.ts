import { clsx, type ClassValue } from "clsx";
import { LatLngTuple } from "leaflet";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const deg2rad = (deg: number) => (deg * Math.PI) / 180;
const R = 6371; // radius of the earth in km

// https://www.movable-type.co.uk/scripts/latlong.html
export function equiRectDist(d0: LatLngTuple, d1: LatLngTuple) {
  const x =
    (deg2rad(d1[1]) - deg2rad(d0[1])) *
    Math.cos(0.5 * (deg2rad(d1[0]) + deg2rad(d0[0])));
  const y = deg2rad(d1[0]) - deg2rad(d0[0]);
  return R * Math.sqrt(x * x + y * y);
}

export const enumMappings = {
  roles: {
    companyManager: "Comprador/Vendedor",
    companyAdmin: "Administrador de la empresa",
    superAdmin: "Administrador de la plataforma",
  },
  memberShipStatuses: {
    waiting: "En espera",
    accepted: "Aceptada",
    rejected: "Rechazada",
  },
  offerStatus: {
    waiting: "En espera",
    accepted: "Aceptada",
    rejected: "Rechazada",
  },
  auctionStatusMap: {
    available: "Disponible",
    closed: "Cerrado",
    expired: "Expirado",
    sold: "Vendido",
  },
};
