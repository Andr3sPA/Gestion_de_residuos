"use client";

import { PurchaseList, RecordType } from "@/components/PurchaseList";

export default function ManageSales() {
  return <PurchaseList recordType={RecordType.Ventas} />;
}
