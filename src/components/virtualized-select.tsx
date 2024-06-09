// @ts-nocheck

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

const VirtualizedCommand = ({
  height,
  options,
  placeholder,
  selectedOption,
  onSelectOption,
}: {
  height: string | number;
  options: Array<{
    value: string;
    label: JSX.Element | string;
    key: string;
  }>;
  placeholder: string;
  selectedOption: string;
  onSelectOption: (value: string) => void;
}) => {
  const [filteredOptions, setFilteredOptions] = React.useState<
    | {
        value: string;
        label: JSX.Element | string;
        key: string;
      }[]
    | []
  >(options);
  const parentRef = React.useRef(null);

  const virtualizer = useVirtualizer({
    count: filteredOptions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
    overscan: 5,
  });

  const virtualOptions = virtualizer.getVirtualItems();

  const handleSearch = (search: string) => {
    setFilteredOptions(
      options.filter((option) =>
        JSON.parse(option.value)
          .symbol.toLowerCase()
          .includes(search.toLowerCase() ?? [])
      )
    );
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
    }
  };

  return (
    <Command shouldFilter={false} onKeyDown={handleKeyDown}>
      <CommandInput onValueChange={handleSearch} placeholder={placeholder} />
      <CommandList>
        <CommandEmpty>No item found.</CommandEmpty>
        <CommandGroup
          ref={parentRef}
          style={{
            height: height,
            width: "100%",
            overflow: "auto",
          }}
        >
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
            }}
          >
            {virtualOptions.map((virtualOption) => (
              <CommandItem
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: `${virtualOption.size}px`,
                  transform: `translateY(${virtualOption.start}px)`,
                }}
                key={filteredOptions[virtualOption.index].key}
                value={filteredOptions[virtualOption.index].value}
                onSelect={onSelectOption}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedOption ===
                      filteredOptions[virtualOption.index].value
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                <span className="truncate">
                  {filteredOptions[virtualOption.index].label}
                </span>
              </CommandItem>
            ))}
          </div>
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

export function VirtualizedCombobox({
  options,
  value,
  searchPlaceholder = "Search items...",
  width = "400px",
  height = "300px",
  onSelect = () => {},
  valueBtnClassName = "",
  valueBtnVariant = "outline",
}: {
  options: {
    value: string;
    label: JSX.Element | string;
    key: string;
  }[];
  value: string;
  searchPlaceholder?: string;
  width?: string;
  height?: string;
  onSelect?: (value: string) => void;
  valueBtnClassName?: string;
  valueBtnVariant?: string;
}) {
  const [open, setOpen] = React.useState<boolean>(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={valueBtnVariant}
          role="combobox"
          aria-expanded={open}
          className={cn(
            "justify-between",
            valueBtnClassName,
            !value
              ? "text-muted-foreground/[0.6] hover:text-muted-foreground/[0.6]"
              : ""
          )}
          style={{
            width: width,
          }}
        >
          <span className="truncate">
            {value
              ? options.find((option) => option.value === value)?.label
              : searchPlaceholder}
          </span>

          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" style={{ width: width }}>
        <VirtualizedCommand
          height={height}
          options={options}
          placeholder={searchPlaceholder}
          selectedOption={value}
          onSelectOption={(currentValue) => {
            onSelect(currentValue);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
