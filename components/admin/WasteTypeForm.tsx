"use client";

import { toast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2, SaveIcon } from "lucide-react";
import { useState } from "react";
import { SimpleCard } from "../common/SimpleCard";
import { Combobox } from "../input/Combobox";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

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
  const [newTypeName, setNewTypeName] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <SimpleCard className="h-fit" title="Crear tipos de residuo">
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
            <label className="text-sm font-bold">Existentes</label>
            <div className="flex gap-2">
              <Combobox selectable={false} list={types.data} />
            </div>
          </div>
        </div>
      )}
    </SimpleCard>
  );
}
