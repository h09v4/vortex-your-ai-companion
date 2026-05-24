import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface VortexUIState {
  backgroundUrl: string | null;
  setBackgroundUrl: (url: string | null) => void;
  userName: string;
  setUserName: (n: string) => void;
  backendOnline: boolean;
}

const Ctx = createContext<VortexUIState | null>(null);

export function VortexUIProvider({ children }: { children: ReactNode }) {
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null);
  const [userName, setUserName] = useState("Operator");
  const [backendOnline, setBackendOnline] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("vortex_bg");
    if (stored) setBackgroundUrl(stored);
    const n = localStorage.getItem("vortex_name");
    if (n) setUserName(n);
  }, []);

  useEffect(() => {
    if (backgroundUrl) localStorage.setItem("vortex_bg", backgroundUrl);
    else localStorage.removeItem("vortex_bg");
  }, [backgroundUrl]);

  useEffect(() => {
    localStorage.setItem("vortex_name", userName);
  }, [userName]);

  useEffect(() => {
    let cancelled = false;
    const ping = async () => {
      try {
        const ctl = new AbortController();
        const t = setTimeout(() => ctl.abort(), 2000);
        await fetch("http://localhost:8000/health", { signal: ctl.signal });
        clearTimeout(t);
        if (!cancelled) setBackendOnline(true);
      } catch {
        if (!cancelled) setBackendOnline(false);
      }
    };
    ping();
    const id = setInterval(ping, 10000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return (
    <Ctx.Provider value={{ backgroundUrl, setBackgroundUrl, userName, setUserName, backendOnline }}>
      {children}
    </Ctx.Provider>
  );
}

export function useVortexUI() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useVortexUI must be used within VortexUIProvider");
  return v;
}
