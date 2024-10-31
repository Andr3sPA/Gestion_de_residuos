import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { Loader2, Search } from "lucide-react";
import React, { ReactNode } from "react";
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
import { IconLeft, IconRight } from "react-day-picker";

export function TableList<T>({
  columns,
  hidden = [],
  data,
  isLoading = false,
  headerActions,
}: {
  columns: ColumnDef<T>[];
  hidden?: string[];
  data: T[];
  isLoading?: boolean;
  headerActions?: (columns: Column<T, unknown>[]) => ReactNode;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(
      Object.fromEntries(hidden.map((h) => [h, false])),
    );
  const [globalFilter, setGlobalFilter] = React.useState("");
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
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
  });

  const [triangleUp, triangleDown] = [
    <span key={"tUp"}>&#9652;</span>,
    <span key={"TDown"}>&#9662;</span>,
  ];

  return (
    <div className="w-full p-1">
      <div className="flex justify-between items-center py-4">
        <div className="border-2 border-gray-300 rounded-lg flex items-center max-w-sm w-1/5 focus-within:w-1/3 transition-width ease-out duration-300">
          <Search className="my-2 ml-1.5" />
          <Input
            placeholder="Buscar..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="border-none pl-2 focus-visible:ring-0 focus-visible:ring-offset-0 "
          />
        </div>
        {headerActions && headerActions(table.getAllColumns())}
      </div>
      <div className="rounded-b-sm border">
        <Table className="overflow-x-auto">
          <TableHeader className="bg-tablehead hover:bg-tablehead">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-tablehead">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-white hover:bg-tablehead"
                  >
                    {header.isPlaceholder ? null : !header.column.columnDef
                        .enableSorting ? (
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )
                    ) : (
                      <Button
                        variant={"ghost"}
                        className="p-0 hover:bg-tablehead"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {header.column.getIsSorted() &&
                          (header.column.getIsSorted() === "desc"
                            ? triangleUp
                            : triangleDown)}
                      </Button>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {!isLoading && table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center w-full"
                >
                  {isLoading ? (
                    <div className="flex justify-center">
                      <Loader2 className="animate-spin" />
                    </div>
                  ) : (
                    "No se encontraron resultados."
                  )}
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
            className="disabled:opacity-20"
          >
            <IconLeft />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="disabled:opacity-20"
          >
            <IconRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
