import { Link, useRouterState } from "@tanstack/react-router";
import { Home, MessageSquare, CheckSquare, Brain, BarChart3, Settings } from "lucide-react";
import { useVortexUI } from "@/hooks/useVortexUI";

const tabs = [
  { to: "/", label: "Home", icon: Home },
  { to: "/chat", label: "Chat", icon: MessageSquare },
  { to: "/tasks", label: "Tasks", icon: CheckSquare },
  { to: "/brain", label: "Brain", icon: Brain },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function TopNav() {
  const { location } = useRouterState();
  const { backendOnline } = useVortexUI();
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
      <div className="glass flex items-center gap-1 rounded-full px-2 py-1.5 max-w-full overflow-x-auto scrollbar-thin">
        <div className="flex items-center gap-2 px-3 py-1 border-r border-border mr-1">
          <span className={`h-1.5 w-1.5 rounded-full ${backendOnline ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"}`} />
          <span className="hud-label hidden sm:inline">{backendOnline ? "ONLINE" : "OFFLINE"}</span>
        </div>
        {tabs.map((t) => {
          const active = t.to === "/" ? location.pathname === "/" : location.pathname.startsWith(t.to);
          const Icon = t.icon;
          return (
            <Link
              key={t.to}
              to={t.to}
              className={`flex items-center gap-2 rounded-full px-3 sm:px-4 py-2 text-xs uppercase tracking-widest glass-hover ${active ? "glass-active text-cream" : "text-muted-foreground"}`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="hidden md:inline">{t.label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
