import { UnitTypeForm } from "@/components/UnitTypeForm";
import { WasteTypeForm } from "@/components/WasteTypeForm";

export default function noc() {
  return (
    <div className="flex flex-row flex-wrap">
      <WasteTypeForm />
      <UnitTypeForm />
    </div>
  );
}
