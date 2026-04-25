import { cn } from "@/lib/utils";
import { APPS, type AppId } from "@/data/apps";

export function AppBadge({ appId, size = "sm" }: { appId: AppId; size?: "xs" | "sm" | "md" }) {
  const app = APPS.find((a) => a.id === appId);
  if (!app) return null;
  const Icon = app.icon;
  const sizes = {
    xs: { container: "h-5 px-1.5 text-[10px] gap-1", icon: "h-3 w-3", dot: "h-3 w-3" },
    sm: { container: "h-6 px-2 text-xs gap-1.5", icon: "h-3 w-3", dot: "h-4 w-4" },
    md: { container: "h-7 px-2.5 text-sm gap-1.5", icon: "h-3.5 w-3.5", dot: "h-5 w-5" },
  } as const;
  const s = sizes[size];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-card font-medium text-foreground",
        s.container,
      )}
    >
      <span className={cn("flex shrink-0 items-center justify-center rounded-full text-primary-foreground", s.dot, app.bgVar)}>
        <Icon className={s.icon} />
      </span>
      <span className="truncate">{app.shortName}</span>
    </span>
  );
}
