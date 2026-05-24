import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/analytics")({ component: AnalyticsPage });

const usage = [40, 65, 55, 80, 72, 95, 88, 70, 90, 100, 85, 110, 95, 120];
const stats = [
  { label: "Tasks completed", value: "84", delta: "+12%" },
  { label: "Hours saved", value: "31.4", delta: "+18%" },
  { label: "Memories grown", value: "412", delta: "+7%" },
  { label: "Agent actions", value: "1,208", delta: "+24%" },
];
const models = [
  { name: "Gemini 2.0 Flash", pct: 64 },
  { name: "GPT-5.4", pct: 22 },
  { name: "Groq Llama", pct: 14 },
];

function AnalyticsPage() {
  const max = Math.max(...usage);
  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-4">
        <div className="hud-label">Module · Analytics</div>
        <h1 className="text-2xl text-cream">Telemetry</h1>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {stats.map((s) => (
          <div key={s.label} className="glass glass-hover rounded-2xl p-4">
            <div className="hud-label">{s.label}</div>
            <div className="text-3xl text-cream mt-2 tabular-nums">{s.value}</div>
            <div className="text-[10px] text-emerald-400 mt-1 tracking-widest">{s.delta}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-4 lg:col-span-2">
          <div className="hud-label mb-3">Daily usage · last 14 days</div>
          <div className="flex items-end gap-1 h-48">
            {usage.map((v, i) => (
              <div key={i} className="flex-1 relative group">
                <div
                  className="bg-gradient-to-t from-cream/60 to-cream/20 rounded-sm transition-all hover:from-cream hover:to-cream/40"
                  style={{ height: `${(v / max) * 100}%` }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-muted-foreground tracking-widest">
            <span>14d</span><span>7d</span><span>NOW</span>
          </div>
        </div>

        <div className="glass rounded-2xl p-4">
          <div className="hud-label mb-3">Model usage</div>
          <div className="space-y-3">
            {models.map((m) => (
              <div key={m.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-foreground">{m.name}</span>
                  <span className="text-cream tabular-nums">{m.pct}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-cream/70" style={{ width: `${m.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
