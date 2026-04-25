import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { APPS, ALL_APPS_OPTION, type AppFilter } from "@/data/apps";
import { useAppContext } from "@/context/AppContext";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function AppSwitcher() {
  const { activeApp, setActiveApp } = useAppContext();
  const [open, setOpen] = useState(false);

  const current =
    activeApp === "all"
      ? ALL_APPS_OPTION
      : APPS.find((a) => a.id === activeApp)!;
  const Icon = current.icon;

  const select = (id: AppFilter) => {
    setActiveApp(id);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-10 w-[230px] justify-between gap-2 rounded-lg bg-card pl-2 pr-2 font-medium shadow-sm transition-base hover:bg-accent/40"
        >
          <span className="flex items-center gap-2 truncate">
            <span
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-md text-primary-foreground",
                activeApp === "all" ? "bg-gradient-primary" : `${(current as any).bgVar}`,
              )}
            >
              <Icon className="h-4 w-4" />
            </span>
            <span className="truncate text-sm">{current.shortName ?? current.name}</span>
          </span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Buscar aplicación..." />
          <CommandList>
            <CommandEmpty>Sin resultados.</CommandEmpty>
            <CommandGroup heading="Vista global">
              <CommandItem value="all" onSelect={() => select("all")} className="gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-primary text-primary-foreground">
                  <ALL_APPS_OPTION.icon className="h-4 w-4" />
                </span>
                <div className="flex flex-1 flex-col">
                  <span className="text-sm font-medium">{ALL_APPS_OPTION.name}</span>
                  <span className="text-xs text-muted-foreground">Consolidado</span>
                </div>
                {activeApp === "all" && <Check className="h-4 w-4 text-primary" />}
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Aplicaciones SaaS">
              {APPS.filter((a) => a.category === "saas").map((app) => {
                const I = app.icon;
                const selected = activeApp === app.id;
                return (
                  <CommandItem key={app.id} value={app.name} onSelect={() => select(app.id)} className="gap-2">
                    <span className={cn("flex h-7 w-7 items-center justify-center rounded-md text-primary-foreground", app.bgVar)}>
                      <I className="h-4 w-4" />
                    </span>
                    <div className="flex flex-1 flex-col">
                      <span className="text-sm font-medium">{app.name}</span>
                      <span className="text-xs text-muted-foreground">{app.active ? "Activa" : "En preparación"}</span>
                    </div>
                    {selected && <Check className="h-4 w-4 text-primary" />}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Core ERP">
              {APPS.filter((a) => a.category === "core").map((app) => {
                const I = app.icon;
                const selected = activeApp === app.id;
                return (
                  <CommandItem key={app.id} value={app.name} onSelect={() => select(app.id)} className="gap-2">
                    <span className={cn("flex h-7 w-7 items-center justify-center rounded-md text-primary-foreground", app.bgVar)}>
                      <I className="h-4 w-4" />
                    </span>
                    <div className="flex flex-1 flex-col">
                      <span className="text-sm font-medium">{app.name}</span>
                      <span className="text-xs text-muted-foreground">Interno</span>
                    </div>
                    {selected && <Check className="h-4 w-4 text-primary" />}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
