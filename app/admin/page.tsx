import { CompanyForm } from "@/components/admin/CompanyForm";
import { ManageUsers } from "@/components/admin/ManageUsers";
import { UnitTypeForm } from "@/components/admin/UnitTypeForm";
import { WasteTypeForm } from "@/components/admin/WasteTypeForm";
import { cn } from "@/lib/utils";

export default function noc() {
  return (
    <div
      className={cn(
        "flex md:flex-row md:flex-wrap md:justify-center md:items-stretch",
        "p-2 max-w-full flex-col items-center",
      )}
    >
      <CompanyForm />
      <div className="w-fit flex flex-row md:items-center md:flex-col justify-center flex-wrap sm:flex-nowrap">
        <WasteTypeForm />
        <UnitTypeForm />
      </div>
      <ManageUsers />
    </div>
  );
}
