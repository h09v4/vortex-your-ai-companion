import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/hooks/useAuth";
import { NeuralOrb } from "@/components/vortex/NeuralOrb";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && session) navigate({ to: "/" });
  }, [loading, session, navigate]);

  const handleGoogle = async () => {
    setBusy(true);
    setErr(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setErr(result.error.message || "Sign-in failed");
      setBusy(false);
      return;
    }
    if (result.redirected) return;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="flex flex-col items-center text-center mb-8 animate-fade-up">
        <div className="hud-label mb-2">VORTEX · ACCESS GATE</div>
        <NeuralOrb size={220} />
      </div>
      <div className="glass rounded-2xl p-8 max-w-sm w-full text-center animate-fade-up">
        <h1 className="text-2xl text-cream font-light mb-2 tracking-tight">Authenticate</h1>
        <p className="text-xs text-muted-foreground mb-6 tracking-wider">
          Sign in with Google to enter the grid.
        </p>
        <button
          onClick={handleGoogle}
          disabled={busy}
          className="glass glass-hover w-full rounded-full px-4 py-3 text-xs uppercase tracking-widest text-cream flex items-center justify-center gap-3 disabled:opacity-50"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M12 5c1.6 0 3.1.6 4.2 1.6l3.1-3.1C17.4 1.7 14.9.7 12 .7 7.4.7 3.4 3.3 1.4 7.1l3.6 2.8C6 7.1 8.7 5 12 5z"/>
            <path fill="#4285F4" d="M23.3 12.3c0-.9-.1-1.7-.2-2.5H12v4.7h6.3c-.3 1.6-1.2 2.9-2.5 3.8l3.5 2.7c2-1.9 3.2-4.7 3.2-8.7z"/>
            <path fill="#FBBC05" d="M5 14c-.2-.6-.4-1.3-.4-2s.1-1.4.4-2L1.4 7.1C.5 8.6 0 10.3 0 12s.5 3.4 1.4 4.9L5 14z"/>
            <path fill="#34A853" d="M12 23.3c3 0 5.5-1 7.3-2.7l-3.5-2.7c-1 .7-2.3 1.1-3.8 1.1-3.3 0-6-2.1-7-5l-3.6 2.8C3.4 20.7 7.4 23.3 12 23.3z"/>
          </svg>
          <span>{busy ? "Connecting..." : "Continue with Google"}</span>
        </button>
        {err && <p className="mt-4 text-xs text-red-400">{err}</p>}
      </div>
    </div>
  );
}
