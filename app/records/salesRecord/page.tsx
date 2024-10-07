'use client';
import { ManagePurchases } from "@/app/manage/purchases/page";

import { RecordType } from "@/app/manage/purchases/page"; // Ajusta la ruta si es necesario

export default function SalesRecord() {
  return (
    <div>
      <ManagePurchases recordType={RecordType.Ventas} />
    </div>
  );
}