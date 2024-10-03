import { useEffect, useState } from "react";
import axios from "axios";
import * as React from "react";
import { OfferForm } from "../register/offer"; // Asegúrate de que la ruta es correcta
import {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function DataTableWaste() {
  const [data, setData] = useState<Payment[]>([]);
  const [selectedWasteId, setSelectedWasteId] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);


  useEffect(() => {
    axios.get("/api/waste/list")
      .then(function (response) {
        setData(response.data);
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});

  // Define las columnas dentro del componente
  const columns: ColumnDef<Payment>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <div>{row.getValue("id")}</div>,
    },
    {
      accessorKey: "wasteType",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Waste Type
        </Button>
      ),
      cell: ({ row }) => (
        <div className="capitalize">
          {row.original.wasteType ? row.original.wasteType.wasteType : "N/A"}
        </div>
      ),
    },
    {
      id: "unitType",
      header: "Unit Type",
      cell: ({ row }) => {
        const unitType = row.original.unitType;
        return (
          <div className="capitalize">{unitType ? unitType.unitName : "N/A"}</div>
        );
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => <div>{row.getValue("description") || "N/A"}</div>,
    },
    {
      accessorKey: "units",
      header: () => <div className="text-right">Units</div>,
      cell: ({ row }) => {
        const units = parseFloat(row.getValue("units"));
        return <div className="text-right font-medium">{units}</div>;
      },
    },
    {
      accessorKey: "expirationDate",
      header: "Expiration Date",
      cell: ({ row }) => {
        const expirationDate = row.getValue("expirationDate");
        const date = new Date(expirationDate);
        const formattedDate = !isNaN(date.getTime())
          ? date.toLocaleDateString("es-ES")
          : "N/A"; // Muestra "N/A" si la fecha no es válida
        return <div>{formattedDate}</div>;
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
        const createdAt = row.getValue("createdAt");
        const date = new Date(createdAt);
        const formattedDate = !isNaN(date.getTime())
          ? date.toLocaleDateString("es-ES")
          : "N/A"; // Muestra "N/A" si la fecha no es válida
        return <div>{formattedDate}</div>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const wasteId = row.getValue("id") as number;
        return (
          
          <Button onClick={() => setSelectedWasteId(wasteId)}>
            
            Ofertar
          </Button>
        );
      },
    }
  ];

  const table = useReactTable({
    data,
    columns, // Usa las columnas definidas aquí
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  if (selectedWasteId !== null) {
    return <OfferForm wasteId={selectedWasteId} />;
  }

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by ID..."
          value={(table.getColumn("id")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("id")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
