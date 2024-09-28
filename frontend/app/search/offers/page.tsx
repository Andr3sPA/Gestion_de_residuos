import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table";
import { OfferDetails } from "@/components/OfferDetails"
import { Search } from "lucide-react";

export default function searchOffers() {

  const data = [
    ["154", "Plástico", "Botellas de gaseosa", "$200.000", "20 kg"],
    ["155", "Orgánico", "Cáscaras de verduras y frutas", "$122.000", "12 kg"],
    ["4568", "Papel", "Periódicos viejos", "$86.000", "2000 hojas"]
  ]

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
            {data.map((row, idx) => (
              <TableRow key={idx}>
                {row.map((cell, idxC) => (
                  <TableCell key={idx * 100 + idxC}
                    className={idxC === 2 || idxC === 3 ? "font-semibold" : ""}
                  >
                    {idxC === 1 ? <Badge className={`bg-cyan-500`}>{cell}</Badge> : cell}
                  </TableCell>
                ))}
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="rounded-xl text-xs">Detalles</Button>
                    </DialogTrigger>
                    <OfferDetails />
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
}
