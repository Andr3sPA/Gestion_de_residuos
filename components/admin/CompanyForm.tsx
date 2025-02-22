"use client";

import { toast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2, SaveIcon } from "lucide-react";
import { useState } from "react";
import { SimpleCard } from "../common/SimpleCard";
import { Combobox } from "../input/Combobox";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Company } from "@prisma/client";
import { Separator } from "../ui/separator";
import { Collapsible, CollapsibleContent } from "@radix-ui/react-collapsible";

export function CompanyForm() {
  const companies = useQuery({
    queryKey: ["companies"],
    queryFn: () =>
      axios.get("/api/companies/list").then((res) =>
        res.data.companies.map((c: Company) => ({
          id: c.id,
          nit: c.nit,
          phoneNumber: c.phoneNumber,
          label: c.name,
          description: c.description,
          address: c.address,
        })),
      ),
  });
  const [selectedComp, setSelectedComp] = useState<Company | null>(null);
  const [anySelected, setAnySelected] = useState(false);
  const [newComp, setNewComp] = useState({
    name: "",
    nit: "",
    phoneNumber: "",
    description: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);

  const formatNit = (nit: string) => {
    let nitFmt = "";
    Object.values(nit).forEach((c, i) => {
      if (i > 0 && i % 3 === 0) {
        nitFmt += ".";
      }
      nitFmt += c;
    });
    return nitFmt;
  };

  return (
    <SimpleCard title="Crear empresas">
      {companies.isLoading && <Loader2 className="animate-spin" />}
      {companies.isSuccess && (
        <div className="w-full justify-start flex flex-col gap-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();

              if (companies.data.find((c: any) => c.label === newComp.name)) {
                toast({
                  description: `La empresa '${newComp.name}' ya existe, elija otro nombre`,
                });
                return;
              }

              if (newComp.nit.length < 13) {
              }

              setLoading(true);

              axios
                .post("/api/companies/register", newComp)
                .then(() => {
                  companies.refetch();
                  toast({
                    description: "Creación exitosa",
                  });
                  setLoading(false);
                })
                .catch((err) => {
                  toast({
                    variant: "destructive",
                    description:
                      err.response.data.error ?? "Error al crear empresa",
                  });
                  setLoading(false);
                });
            }}
            className="grid grid-cols-2 gap-x-4 gap-y-2"
          >
            <div>
              <label htmlFor="name" className="text-sm font-bold">
                Nombre
              </label>
              <Input
                id="name"
                type="text"
                required
                placeholder="Nombre de la empresa"
                value={newComp.name}
                onChange={(e) =>
                  setNewComp((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <div>
              <label htmlFor="nit" className="text-sm font-bold">
                NIT
              </label>
              <Input
                value={newComp.nit}
                pattern="\b[0-9]{3}\.[0-9]{3}\.[0-9]{3}\.[0-9]\b"
                onChange={(e) => {
                  const nitNums = e.target.value.replace(/\D/g, "");
                  if (nitNums.length > 10) return;

                  const newNit = setNewComp((prev) => ({
                    ...prev,
                    nit: formatNit(nitNums),
                  }));
                }}
              />
            </div>
            <div className="w-full">
              <label htmlFor="desc" className="text-sm font-bold">
                Descripción
              </label>
              <Input
                id="desc"
                value={newComp.description}
                onChange={(e) =>
                  setNewComp((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label htmlFor="address" className="text-sm font-bold">
                Dirección
              </label>
              <Input
                value={newComp.address}
                onChange={(e) =>
                  setNewComp((prev) => ({
                    ...prev,
                    address: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label htmlFor="phoneNumber" className="text-sm font-bold">
                Número de teléfono
              </label>
              <Input
                value={newComp.phoneNumber}
                onChange={(e) => {
                  setNewComp((prev) => ({
                    ...prev,
                    phoneNumber: e.target.value,
                  }));
                }}
              />
            </div>
            <div className="flex w-full justify-center items-end">
              <Button className="scale-90" disabled={loading} type="submit">
                {loading ? <Loader2 className="animate-spin" /> : <SaveIcon />}
              </Button>
            </div>
          </form>
          <div className="flex flex-col">
            <Separator className="my-2" />
            <label className="text-sm font-bold">Existentes</label>
            <div className="flex gap-2">
              <Combobox
                onSelect={(item) => {
                  if (!item) {
                    setAnySelected(false);
                    return;
                  }
                  const id = parseInt(item.id);
                  if (!isNaN(id)) {
                    const comp = companies.data.find((c: any) => c.id === id);
                    setSelectedComp({
                      id,
                      name: comp.label,
                      address: comp.address,
                      nit: comp.nit,
                      phoneNumber: comp.phoneNumber,
                      description: comp.description,
                    });
                    setAnySelected(true);
                  }
                }}
                list={companies.data}
              />
            </div>
            <Collapsible open={anySelected}>
              <CollapsibleContent
                className={`overflow-hidden transition-all CollapsibleContent`}
              >
                <div className="py-4 pl-1 grid grid-cols-2 text-wrap gap-y-2">
                  <div className="flex flex-col">
                    <span className="font-bold text-sm">Nombre</span>
                    <span className="w-full max-w-44 pl-1 text-sm">
                      {selectedComp?.name}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm">NIT</span>
                    <span className="w-full max-w-44 pl-1 text-sm">
                      {selectedComp?.nit}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm">Descripción</span>
                    <span className="w-full max-w-44 pl-1 text-sm">
                      {selectedComp?.description}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm">Dirección</span>
                    <span className="w-full max-w-44 pl-1 text-sm">
                      {selectedComp?.address}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm">
                      Número de teléfono
                    </span>
                    <span className="w-full max-w-44 pl-1 text-sm">
                      {selectedComp?.phoneNumber}
                    </span>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      )}
    </SimpleCard>
  );
}
