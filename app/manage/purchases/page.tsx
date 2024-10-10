"use client";

import { PurchaseList, RecordType } from "@/components/PurchaseList";

export default function ManagePurchases() {
  return <PurchaseList recordType={RecordType.Compras} />;
}
