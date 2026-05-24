import { type ReactNode, useEffect } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";

export function AuthGate({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth();
  const { location } = useRouterState();
  const navigate = useNavigate();
  const isLogin = location.pathname === "/login";

  useEffect(() => {
    if (loading) return;
    if (!session && !isLogin) navigate({ to: "/login" });
  }, [session, loading, isLogin, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="hud-label animate-pulse">VORTEX · BOOTING</div>
      </div>
    );
  }

  if (!session && !isLogin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="hud-label animate-pulse">REDIRECTING</div>
      </div>
    );
  }

  return <>{children}</>;
}
