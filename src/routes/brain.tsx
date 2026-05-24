import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { FileText, Search, Plus } from "lucide-react";

export const Route = createFileRoute("/brain")({ component: BrainPage });

const notes = [
  { id: 1, title: "VORTEX architecture", tags: ["build", "ai"] },
  { id: 2, title: "Daily journal · 2026-05-24", tags: ["journal"] },
  { id: 3, title: "Reading list", tags: ["books"] },
  { id: 4, title: "Workout plan", tags: ["health"] },
];

const facts = [
  "Lives in Karachi · UTC+5",
  "Prefers monospace fonts",
  "Working on personal AI named Vortex",
  "Drinks coffee in the morning, tea after 5pm",
  "Speaks English, Urdu, learning Arabic",
];

function BrainPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const w = c.clientWidth, h = c.clientHeight;
    c.width = w * dpr; c.height = h * dpr; ctx.scale(dpr, dpr);
    const pts = Array.from({ length: 40 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
    }));
    let raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
        const a = pts[i], b = pts[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 90) {
          ctx.strokeStyle = `rgba(255,248,220,${(1 - d/90) * 0.25})`;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      for (const p of pts) {
        ctx.fillStyle = "rgba(255,248,220,0.7)";
        ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI * 2); ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <header className="flex items-center justify-between mb-4">
        <div>
          <div className="hud-label">Module · Brain</div>
          <h1 className="text-2xl text-cream">Memory & vault</h1>
        </div>
        <button className="glass glass-hover rounded-full px-4 py-2 text-[10px] uppercase tracking-widest text-cream flex items-center gap-2"><Plus className="h-3 w-3" /> Connect Obsidian</button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-4 lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <span className="hud-label">Knowledge graph</span>
            <span className="text-[10px] text-cream/70">{notes.length * 7} nodes</span>
          </div>
          <canvas ref={canvasRef} className="w-full h-72 rounded-xl" />
        </div>

        <div className="glass rounded-2xl p-4">
          <div className="hud-label mb-3">What Vortex knows</div>
          <ul className="space-y-2 text-sm">
            {facts.map((f) => (
              <li key={f} className="glass glass-hover rounded-lg px-3 py-2 text-foreground/90 text-xs">{f}</li>
            ))}
          </ul>
        </div>

        <div className="glass rounded-2xl p-4 lg:col-span-3">
          <div className="flex items-center gap-2 mb-3">
            <Search className="h-4 w-4 text-cream/70" />
            <input placeholder="Search notes, memories, documents..." className="flex-1 bg-transparent outline-none text-sm py-1" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {notes.map((n) => (
              <div key={n.id} className="glass glass-hover rounded-xl p-3">
                <FileText className="h-4 w-4 text-cream/80 mb-2" />
                <div className="text-sm text-foreground">{n.title}</div>
                <div className="flex gap-1 mt-2">
                  {n.tags.map((t) => <span key={t} className="text-[9px] uppercase tracking-widest text-muted-foreground border border-border rounded-full px-2 py-0.5">{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
