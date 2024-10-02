"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
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

export function DataTableOffer() {
  const [data, setData] = useState<Payment[]>([]);
  
  useEffect(() => {
    axios.get("/api/offer/list")
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

  const table = useReactTable({
    data,
    columns,
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

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by Offer ID..."
          value={(table.getColumn("offerId")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("offerId")?.setFilterValue(event.target.value)
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

export type Payment = {
  offerId: number; // Cambiar 'id' a 'offerId'
  wasteId: number; // Agregar wasteId
  units: number;
  companySeller: {
    name: string;
  };
  offerPrice: string;
  createdAt: string;
  status: string;
  expirationDate: string; // Agregar expirationDate
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "offerId",
    header: "Offer ID", // Cambiar el encabezado a "Offer ID"
    cell: ({ row }) => <div>{row.original.id}</div>, // Mostrar el valor original
  },
  {
    accessorKey: "wasteId",
    header: "Waste ID", // Encabezado para wasteId
    cell: ({ row }) => <div>{row.original.waste.id}</div>, // Mostrar el ID de waste
  },
  {
    accessorKey: "companySeller",
    header: "Company Name",
    cell: ({ row }) => (
      <div className="capitalize">{row.original.companySeller.name}</div>
    ),
  },
  {
    accessorKey: "offerPrice",
    header: "Offer Price",
    cell: ({ row }) => <div>{row.getValue("offerPrice")}</div>,
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <div>{row.getValue("status")}</div>,
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
];

