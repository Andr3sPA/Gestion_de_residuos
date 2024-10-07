'use client';
import { ManagePurchases } from "@/app/manage/purchases/page";

import { RecordType } from "@/app/manage/purchases/page"; // Ajusta la ruta si es necesario

export default function ShoppingRecord() {
  return (
    <div>
      <ManagePurchases recordType={RecordType.Compras} />
    </div>
  );
}