import { Loader2 } from "lucide-react";
import { SimpleCard } from "../common/SimpleCard";
import { Effectivity } from "./Effectivity";
import { Proportion } from "./Proportion";
import { PurchasesChart } from "./PurchasesChart";
import { Auction, Offer } from "@prisma/client";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { CO2Chart } from "./CO2Chart";

export function Stats() {
  const { status, data } = useSession();
  const auctionsAndOffers = useQuery({
    queryKey: ["allAuctionsAndOffers"],
    queryFn: () => {
      return Promise.all([
        axios
          .get("/api/auctions/listAll")
          .then((res) => res.data.auctions as Auction[]),
        axios
          .get("/api/offers/listAll")
          .then((res) => res.data.offers as Offer[]),
      ]);
    },
  });

  if (status === "unauthenticated") return <div>Nothing</div>;
  if (status === "loading")
    return (
      <div>
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <div className="flex w-full md:px-8 p-2 md:flex-row flex-col justify-center md:items-start items-stretch">
      <div className="flex flex-col flex-grow items-stretch w-auto">
        <SimpleCard title={`Hola!, ${data?.user?.name}`} className="w-auto">
          {auctionsAndOffers.isLoading && (
            <div>
              <Loader2 className="animate-spin" />
            </div>
          )}
          {auctionsAndOffers.isSuccess && (
            <div className="w-full">
              <span>Existen en promedio </span>
              <span className="text-lg font-semibold">
                {parseFloat(
                  (
                    auctionsAndOffers.data[1].length /
                    auctionsAndOffers.data[0].length
                  ).toFixed(1),
                )}{" "}
              </span>
              <span className="font-semibold text-sm">ofertas </span>
              <span>por </span>
              <span className="font-semibold text-sm">subasta</span>
            </div>
          )}
          {auctionsAndOffers.isError && (
            <div className="w-full">
              <span>
                Hubo un error al cargar los datos, vuelva a recargar la página
              </span>
            </div>
          )}
        </SimpleCard>
        <SimpleCard
          title="Contribución de tu empresa al medioambiente"
          desc="Estas son las emisiones de carbono que tu empresa logró evitar con la venta y compra de residuos"
          titleCenter
          className="flex-grow overflow-auto h-fit w-auto px-0 py-0.5"
        >
          <CO2Chart />
        </SimpleCard>
        <SimpleCard
          title="Histórico de ventas"
          desc="Resumen de ventas hechas en la plataforma"
          titleCenter
          className="flex-grow overflow-auto h-fit w-auto px-0 py-0.5"
        >
          <PurchasesChart />
        </SimpleCard>
      </div>
      <div className="flex flex-col items-stretch">
        <SimpleCard
          title="Estado de las subastas"
          titleCenter
          className="px-0 py-0.5 w-auto"
        >
          <Effectivity />
        </SimpleCard>
        <SimpleCard
          title="Subastas vendidas y ofertas aceptadas"
          titleCenter
          className="pt-0 mt-0 w-auto"
        >
          <div className="flex flex-col items-center w-auto">
            {auctionsAndOffers.isLoading && (
              <Loader2 className="animate-spin" />
            )}
            {auctionsAndOffers.isSuccess && (
              <>
                <Proportion data={auctionsAndOffers.data[0]} />
                <Separator className="m-2" />
                <Proportion data={auctionsAndOffers.data[1]} />
              </>
            )}
            {auctionsAndOffers.isError && (
              <span>Error al cargar los datos</span>
            )}
          </div>
        </SimpleCard>
      </div>
    </div>
  );
}
