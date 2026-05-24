import {
  Cloud, Clock, ListChecks, HeartPulse, Music, Cpu, CalendarDays, Newspaper, TrendingUp, Timer,
} from "lucide-react";
import { Widget } from "./Widget";
import { useEffect, useState } from "react";

export function WeatherWidget() {
  return (
    <Widget title="Weather" accent="LIVE">
      <div className="flex items-center gap-3">
        <Cloud className="h-8 w-8 text-cream/80" />
        <div>
          <div className="text-2xl text-cream">21°C</div>
          <div className="text-xs text-muted-foreground">Karachi · Clear</div>
        </div>
      </div>
    </Widget>
  );
}

export function TimeWidget() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <Widget title="System Time" accent="UTC+5">
      <div className="flex items-end gap-3">
        <Clock className="h-6 w-6 text-cream/60 mb-1" />
        <div>
          <div className="text-3xl text-cream tabular-nums">{now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</div>
          <div className="text-xs text-muted-foreground">{now.toDateString()}</div>
        </div>
      </div>
    </Widget>
  );
}

export function TasksWidget() {
  return (
    <Widget title="Tasks" accent="3 / 7">
      <div className="space-y-2">
        {["Review pull request", "Prepare demo", "Email client"].map((t) => (
          <div key={t} className="flex items-center gap-2 text-sm text-foreground/90">
            <ListChecks className="h-3.5 w-3.5 text-cream/70" />
            <span>{t}</span>
          </div>
        ))}
      </div>
    </Widget>
  );
}

export function HealthWidget() {
  return (
    <Widget title="Health" accent="OK">
      <div className="flex items-center gap-3">
        <HeartPulse className="h-8 w-8 text-cream/80" />
        <div className="grid grid-cols-2 gap-x-4 text-xs">
          <div className="text-muted-foreground">HR</div><div className="text-cream">72 bpm</div>
          <div className="text-muted-foreground">Steps</div><div className="text-cream">6,402</div>
          <div className="text-muted-foreground">Sleep</div><div className="text-cream">7h 12m</div>
        </div>
      </div>
    </Widget>
  );
}

export function MusicWidget() {
  return (
    <Widget title="Now Playing" accent="♪">
      <div className="flex items-center gap-3">
        <Music className="h-8 w-8 text-cream/80" />
        <div>
          <div className="text-sm text-cream">Strobe</div>
          <div className="text-xs text-muted-foreground">deadmau5</div>
        </div>
      </div>
      <div className="mt-3 h-1 rounded-full bg-white/10">
        <div className="h-full w-1/3 rounded-full bg-cream/70" />
      </div>
    </Widget>
  );
}

export function PCHealthWidget() {
  return (
    <Widget title="PC Health" accent="STABLE">
      <div className="flex items-center gap-3">
        <Cpu className="h-8 w-8 text-cream/80" />
        <div className="grid grid-cols-2 gap-x-4 text-xs">
          <div className="text-muted-foreground">CPU</div><div className="text-cream">34%</div>
          <div className="text-muted-foreground">RAM</div><div className="text-cream">12.4 GB</div>
          <div className="text-muted-foreground">GPU</div><div className="text-cream">22%</div>
        </div>
      </div>
    </Widget>
  );
}

export function CalendarWidget() {
  return (
    <Widget title="Calendar" accent="TODAY">
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2"><CalendarDays className="h-3.5 w-3.5 text-cream/70" /><span className="text-cream">10:00</span><span className="text-muted-foreground">Standup</span></div>
        <div className="flex items-center gap-2"><CalendarDays className="h-3.5 w-3.5 text-cream/70" /><span className="text-cream">14:30</span><span className="text-muted-foreground">Design review</span></div>
        <div className="flex items-center gap-2"><CalendarDays className="h-3.5 w-3.5 text-cream/70" /><span className="text-cream">18:00</span><span className="text-muted-foreground">Workout</span></div>
      </div>
    </Widget>
  );
}

export function NewsWidget() {
  return (
    <Widget title="News" accent="FEED">
      <div className="space-y-2 text-xs">
        {["NASA confirms Mars sample return", "GPT next-gen multimodal benchmarks", "EU passes AI safety bill"].map((n) => (
          <div key={n} className="flex items-start gap-2">
            <Newspaper className="h-3 w-3 mt-0.5 text-cream/70 flex-shrink-0" />
            <span className="text-foreground/85">{n}</span>
          </div>
        ))}
      </div>
    </Widget>
  );
}

export function MarketsWidget() {
  return (
    <Widget title="Markets" accent="USD">
      <div className="space-y-1.5 text-xs">
        {[
          ["BTC", "67,420", "+1.2%"],
          ["ETH", "3,510", "-0.4%"],
          ["NVDA", "942.10", "+2.8%"],
        ].map(([s, p, c]) => (
          <div key={s} className="flex items-center justify-between">
            <span className="text-muted-foreground">{s}</span>
            <span className="text-cream tabular-nums">{p}</span>
            <span className={`tabular-nums ${c.startsWith("+") ? "text-emerald-400" : "text-red-400"}`}>{c}</span>
          </div>
        ))}
        <TrendingUp className="hidden" />
      </div>
    </Widget>
  );
}

export function FocusWidget() {
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [running]);
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return (
    <Widget title="Focus Timer" accent={running ? "RUN" : "IDLE"}>
      <div className="flex items-center gap-3">
        <Timer className="h-7 w-7 text-cream/80" />
        <div className="text-3xl text-cream tabular-nums">{m}:{s}</div>
      </div>
      <div className="mt-3 flex gap-2">
        <button onClick={() => setRunning((r) => !r)} className="glass glass-hover rounded-full px-3 py-1 text-[10px] uppercase tracking-widest">{running ? "Pause" : "Start"}</button>
        <button onClick={() => { setRunning(false); setSeconds(25 * 60); }} className="glass glass-hover rounded-full px-3 py-1 text-[10px] uppercase tracking-widest">Reset</button>
      </div>
    </Widget>
  );
}
