'use client'

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table";
import { OfferDetails } from "@/components/OfferDetails"
import { Loader2, Search } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

export default function searchOffers() {
  const [data, setData] = useState<{ status: string, list: any[] }>({ status: "pending", list: [] })

  useEffect(() => {
    setData((prevData) => ({ ...prevData, status: "loading" }))
    axios.get("/api/offer/search")
      .then((res) => setData({ status: "ok", list: res.data.offers }))
      .catch((err) => setData((prevData) => ({ ...prevData, status: "error" })))
  }, [])

  const colors = [
    "#0011ee", "#00ee33", "#DDDDDD"
  ]

  return <div className="flex flex-1 flex-col w-full h-full justify-start items-center">
    <Card className="w-2/3">
      <CardHeader className="px-7 grid grid-cols-2">
        <div>
          <CardTitle>Ofertas</CardTitle>
          <CardDescription>
            Busca aquí los residuos que ofrecen otras empresas
          </CardDescription>
        </div>
        <div className="relative ml-auto flex-1 md:grow-0">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar..."
            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Precio total</TableHead>
              <TableHead>Cantidad</TableHead>
              <TableHead>
                <span className="sr-only">Detalles</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              data.status === "ok" &&
              data.list.map((offer, idx) => (
                <TableRow key={idx}>
                  <TableCell>{offer.id}</TableCell>
                  <TableCell>{offer.waste.wasteType.wasteType}</TableCell>
                  <TableCell>{offer.waste.description}</TableCell>
                  <TableCell>${offer.offerPrice}</TableCell>
                  <TableCell>{offer.units} {offer.waste.unitType.unitName}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="rounded-xl text-xs">Detalles</Button>
                      </DialogTrigger>
                      <OfferDetails offerInfo={offer} />
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
        {data.status === "loading" &&
          <div className="flex justify-center p-2">
            <Loader2 className="animate-spin" />
          </div>
        }
      </CardContent>
    </Card>
  </div>
}
