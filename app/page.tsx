'use client';
import { ManagePurchases } from "./manage/purchases/page";
import {ManageMyOffers} from "./manage/myOffers/page"
// Importamos el enum RecordType
import { RecordType } from "./manage/purchases/page"; // Ajusta la ruta si es necesario

export default function Home() {
  return (
    <div>
      Nothing
      <ManageMyOffers/>
      {/* Usamos el valor del enum en lugar de un string */}
      <ManagePurchases recordType={RecordType.Ventas} />
    </div>
  );
}

