import { UnitTypeForm } from "@/components/UnitTypeForm";
import { WasteTypeForm } from "@/components/WasteTypeForm";
import { ManageUsers } from "../manage/users/page";

export default function noc() {
  return (
    <div className="flex flex-row flex-wrap">
      <ManageUsers/>
      <WasteTypeForm />
      <UnitTypeForm />
    </div>
  );
}
