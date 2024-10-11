"use client";

import { useQuery } from "@tanstack/react-query";
import { SimpleCard } from "./common/SimpleCard";
import { Input } from "./ui/input";
import axios from "axios";
import { Loader2, SaveIcon, XIcon } from "lucide-react";
import { Combobox } from "./input/Combobox";
import { useState } from "react";
import { Button } from "./ui/button";
import { toast } from "@/hooks/use-toast";

export function WasteTypeForm() {
  const types = useQuery({
    queryKey: ["wasteTypes"],
    queryFn: () =>
      axios.get("/api/wastes/wasteTypes").then((res) =>
        res.data.types.map((t: { id: number; name: string }) => ({
          id: t.id,
          label: t.name,
        })),
      ),
  });
  const [selected, setSelected] = useState<number | null>(null);
  const [newTypeName, setNewTypeName] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <SimpleCard title="Crear tipo de residuo">
      {types.isLoading && <Loader2 className="animate-spin" />}
      {types.isSuccess && (
        <div className="w-full justify-start grid grid-rows-2 gap-4">
          <div className="w-full">
            <label htmlFor="name" className="text-sm font-bold">
              Nombre
            </label>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setLoading(true);
                axios
                  .post("/api/wastes/wasteTypes", {
                    name: newTypeName,
                  })
                  .then(() => {
                    types.refetch();
                    toast({
                      description: "Creación exitosa",
                    });
                    setLoading(false);
                  })
                  .catch((err) => {
                    toast({
                      variant: "destructive",
                      description:
                        err.response.data.error ??
                        "Error al crear tipo de residuo",
                    });
                    setLoading(false);
                  });
              }}
              className="flex gap-2"
            >
              <Input
                id="name"
                type="text"
                placeholder="Ingrese el nombre del residuo"
                value={newTypeName}
                onChange={(e) => setNewTypeName(e.target.value)}
              />
              <Button className="scale-90" disabled={loading} type="submit">
                {loading ? <Loader2 className="animate-spin" /> : <SaveIcon />}
              </Button>
            </form>
          </div>

          <div className="flex flex-col">
            <label htmlFor="wasteToDelete" className="text-sm font-bold">
              Existentes
            </label>
            <div className="flex gap-2">
              <Combobox selectable={false} list={types.data} />
            </div>
          </div>
        </div>
      )}
    </SimpleCard>
  );
}
