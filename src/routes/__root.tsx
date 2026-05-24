import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet, createRootRouteWithContext, useRouter, HeadContent, Scripts,
} from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { TopNav } from "@/components/vortex/TopNav";
import { Background } from "@/components/vortex/Background";
import { VortexUIProvider } from "@/hooks/useVortexUI";
import { AuthProvider } from "@/hooks/useAuth";
import { AuthGate } from "@/components/vortex/AuthGate";
import { useRouterState } from "@tanstack/react-router";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass rounded-2xl p-8 text-center">
        <div className="hud-label mb-2">ERROR · 404</div>
        <h1 className="text-3xl text-cream mb-2">SIGNAL LOST</h1>
        <p className="text-sm text-muted-foreground mb-4">The requested route is not in the grid.</p>
        <a href="/" className="glass glass-hover inline-block rounded-full px-4 py-2 text-xs uppercase tracking-widest text-cream">Return Home</a>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass rounded-2xl p-8 text-center max-w-md">
        <div className="hud-label mb-2 text-red-400">SYS · FAULT</div>
        <h1 className="text-2xl text-cream mb-2">Something glitched</h1>
        <p className="text-xs text-muted-foreground mb-4">{error.message}</p>
        <button onClick={() => { router.invalidate(); reset(); }} className="glass glass-hover rounded-full px-4 py-2 text-xs uppercase tracking-widest text-cream">Retry</button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "VORTEX · Personal AI" },
      { name: "description", content: "VORTEX — your personal AI assistant. Glass HUD, neural memory, agent-grade workflows." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <VortexUIProvider>
          <Background />
          <InnerShell />
        </VortexUIProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

function InnerShell() {
  const { location } = useRouterState();
  const isLogin = location.pathname === "/login";
  return (
    <AuthGate>
      {!isLogin && <TopNav />}
      <main className={`${isLogin ? "" : "pt-24"} pb-12 px-4 min-h-screen`}>
        <Outlet />
      </main>
    </AuthGate>
  );
}
