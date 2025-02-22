import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ReactNode, useEffect, useState } from "react";
import { Search } from "lucide-react";

export interface ComboboxItem {
  id: string;
  label: string;
}

export function Combobox({
  placeholder,
  prompt,
  icon,
  list,
  onSelect,
  selectable = true,
}: {
  placeholder?: string;
  prompt?: string;
  icon?: ReactNode;
  list: ComboboxItem[];
  onSelect?: (item: ComboboxItem | null) => void;
  selectable?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [selectedLabel, setLabel] = useState<string | null>(null);

  return (
    <Popover modal={true} open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-hidden={false}
          className="flex justify-between w-full"
        >
          {icon}
          {selectedLabel ?? (
            <span className="w-[80%] overflow-clip">
              {selectable ? (prompt ?? "Seleccione una opción") : ""}{" "}
            </span>
          )}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-0">
        <Command>
          <CommandInput placeholder={placeholder} className="h-9" />
          <CommandList>
            <CommandEmpty>Sin resultados</CommandEmpty>
            <CommandGroup>
              {list.map((item) => (
                <CommandItem
                  key={item.label}
                  value={item.label}
                  onSelect={(label) => {
                    const nextLabel = label === selectedLabel ? null : label;
                    setOpen(false);
                    if (!selectable) return;
                    setLabel(nextLabel);
                    onSelect &&
                      onSelect(
                        list.find((item) => item.label === nextLabel) ?? null,
                      );
                  }}
                  className={
                    selectable
                      ? "hover:cursor-pointer"
                      : "hover:cursor-not-allowed"
                  }
                >
                  {item.label}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedLabel === item.label
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
