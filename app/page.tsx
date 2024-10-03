'use client'
import { DataTableWaste } from "@/components/list/waste";
import { DataTableOffer } from "../components/list/offer";
import { CounterOfferForm } from "@/components/register/counterOffer";
export default function Home() {
  return (<div>
    Notghig      
    <h1>Tabla de Pagos</h1>
      <DataTableWaste/>
      <DataTableOffer/>
      </div>
  );
}
