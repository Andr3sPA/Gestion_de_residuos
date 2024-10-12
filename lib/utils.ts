import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
};
