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

const CLUSTERS = [
  "memory", "skills", "journal", "projects", "people",
  "books", "ideas", "health", "code", "research",
];

type GNode = {
  id: number; label: string; cluster: number;
  x: number; y: number; vx: number; vy: number;
  r: number; degree: number;
};
type GEdge = { a: number; b: number };

function buildGraph(): { nodes: GNode[]; edges: GEdge[] } {
  const nodes: GNode[] = [];
  const edges: GEdge[] = [];
  let id = 0;
  const hubIds: number[] = [];
  CLUSTERS.forEach((name, ci) => {
    const hubId = id++;
    hubIds.push(hubId);
    nodes.push({ id: hubId, label: name, cluster: ci, x: 0, y: 0, vx: 0, vy: 0, r: 6, degree: 0 });
    const leafCount = 14 + Math.floor(Math.random() * 18);
    const clusterLeafIds: number[] = [];
    for (let i = 0; i < leafCount; i++) {
      const nid = id++;
      clusterLeafIds.push(nid);
      nodes.push({
        id: nid,
        label: `${name}-${(i + 1).toString().padStart(3, "0")}`,
        cluster: ci, x: 0, y: 0, vx: 0, vy: 0,
        r: 1.6 + Math.random() * 1.2, degree: 0,
      });
      edges.push({ a: hubId, b: nid });
      if (i > 1 && Math.random() < 0.3) {
        const other = clusterLeafIds[Math.floor(Math.random() * (clusterLeafIds.length - 1))];
        if (other !== nid) edges.push({ a: nid, b: other });
      }
    }
  });
  for (let i = 0; i < hubIds.length; i++) {
    for (let j = i + 1; j < hubIds.length; j++) {
      if (Math.random() < 0.3) edges.push({ a: hubIds[i], b: hubIds[j] });
    }
  }
  for (const e of edges) { nodes[e.a].degree++; nodes[e.b].degree++; }
  for (const n of nodes) n.r = Math.max(1.4, Math.min(8, 1.4 + Math.sqrt(n.degree) * 1.3));
  return { nodes, edges };
}

function BrainPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;

    let w = c.clientWidth, h = c.clientHeight;
    const resize = () => {
      w = c.clientWidth; h = c.clientHeight;
      c.width = w * dpr; c.height = h * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.scale(dpr, dpr);
    };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(c);

    const { nodes, edges } = buildGraph();
    const clusterCenters = CLUSTERS.map((_, i) => {
      const ang = (i / CLUSTERS.length) * Math.PI * 2;
      const R = Math.min(w, h) * 0.3;
      return { x: w / 2 + Math.cos(ang) * R, y: h / 2 + Math.sin(ang) * R };
    });
    for (const n of nodes) {
      const cc = clusterCenters[n.cluster];
      n.x = cc.x + (Math.random() - 0.5) * 80;
      n.y = cc.y + (Math.random() - 0.5) * 80;
    }

    let dragging: GNode | null = null;
    let hover: GNode | null = null;
    let zoom = 1;
    const pan = { x: 0, y: 0 };
    const toWorld = (mx: number, my: number) => ({ x: (mx - pan.x) / zoom, y: (my - pan.y) / zoom });

    const onMove = (e: MouseEvent) => {
      const rect = c.getBoundingClientRect();
      const mx = e.clientX - rect.left, my = e.clientY - rect.top;
      const wpt = toWorld(mx, my);
      if (dragging) { dragging.x = wpt.x; dragging.y = wpt.y; dragging.vx = 0; dragging.vy = 0; return; }
      hover = null;
      for (const n of nodes) if (Math.hypot(n.x - wpt.x, n.y - wpt.y) < n.r + 4) { hover = n; break; }
    };
    const onDown = (e: MouseEvent) => {
      const rect = c.getBoundingClientRect();
      const wpt = toWorld(e.clientX - rect.left, e.clientY - rect.top);
      for (const n of nodes) if (Math.hypot(n.x - wpt.x, n.y - wpt.y) < n.r + 4) { dragging = n; return; }
    };
    const onUp = () => { dragging = null; };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = c.getBoundingClientRect();
      const mx = e.clientX - rect.left, my = e.clientY - rect.top;
      const before = toWorld(mx, my);
      zoom = Math.max(0.4, Math.min(3, zoom * (e.deltaY < 0 ? 1.1 : 0.9)));
      const after = toWorld(mx, my);
      pan.x += (after.x - before.x) * zoom;
      pan.y += (after.y - before.y) * zoom;
    };
    c.addEventListener("mousemove", onMove);
    c.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    c.addEventListener("wheel", onWheel, { passive: false });

    const clusterHues = CLUSTERS.map((_, i) => (i / CLUSTERS.length) * 360);

    let raf = 0;
    const step = () => {
      const k = 0.012;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        const cc = clusterCenters[a.cluster];
        a.vx += (cc.x - a.x) * 0.0008;
        a.vy += (cc.y - a.y) * 0.0008;
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = b.x - a.x, dy = b.y - a.y;
          const d2 = dx * dx + dy * dy + 0.01;
          if (d2 > 22000) continue;
          const dd = Math.sqrt(d2);
          const f = 220 / d2;
          const fx = (dx / dd) * f, fy = (dy / dd) * f;
          a.vx -= fx; a.vy -= fy;
          b.vx += fx; b.vy += fy;
        }
      }
      for (const e of edges) {
        const a = nodes[e.a], b = nodes[e.b];
        const dx = b.x - a.x, dy = b.y - a.y;
        const d = Math.hypot(dx, dy) || 0.01;
        const target = a.cluster === b.cluster ? 42 : 140;
        const f = (d - target) * k;
        const fx = (dx / d) * f, fy = (dy / d) * f;
        a.vx += fx; a.vy += fy;
        b.vx -= fx; b.vy -= fy;
      }
      for (const n of nodes) {
        if (n === dragging) continue;
        n.vx *= 0.82; n.vy *= 0.82;
        n.x += n.vx; n.y += n.vy;
      }

      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.translate(pan.x, pan.y);
      ctx.scale(zoom, zoom);

      ctx.lineWidth = 0.6 / zoom;
      for (const e of edges) {
        const a = nodes[e.a], b = nodes[e.b];
        const sameC = a.cluster === b.cluster;
        const hot = hover && (hover.id === a.id || hover.id === b.id);
        ctx.strokeStyle = hot
          ? "rgba(255,248,220,0.55)"
          : sameC
            ? `hsla(${clusterHues[a.cluster]}, 60%, 70%, 0.18)`
            : "rgba(200,210,230,0.07)";
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }

      for (const n of nodes) {
        const isHub = n.degree > 10;
        const hue = clusterHues[n.cluster];
        const hot = hover && hover.id === n.id;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = hot
          ? "rgba(255,248,220,1)"
          : isHub
            ? `hsla(${hue}, 70%, 75%, 0.95)`
            : `hsla(${hue}, 55%, 70%, 0.85)`;
        ctx.shadowBlur = hot ? 14 : isHub ? 8 : 0;
        ctx.shadowColor = `hsla(${hue}, 80%, 70%, 0.6)`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      ctx.font = `${11 / zoom}px ui-sans-serif, system-ui`;
      ctx.textAlign = "center";
      ctx.fillStyle = "rgba(255,248,220,0.9)";
      for (const n of nodes) {
        if (n.degree > 10 || hover === n) {
          ctx.fillText(n.label, n.x, n.y - n.r - 4 / zoom);
        }
      }

      ctx.restore();
      raf = requestAnimationFrame(step);
    };
    step();
    return () => {
      cancelAnimationFrame(raf); ro.disconnect();
      c.removeEventListener("mousemove", onMove);
      c.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      c.removeEventListener("wheel", onWheel);
    };
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
            <span className="text-[10px] text-cream/70">drag nodes · scroll to zoom</span>
          </div>
          <canvas ref={canvasRef} className="w-full h-[480px] rounded-xl bg-black/40 cursor-grab" />
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
