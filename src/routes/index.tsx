import { createFileRoute } from "@tanstack/react-router";
import { NeuralOrb } from "@/components/vortex/NeuralOrb";
import { VoiceBar } from "@/components/vortex/VoiceBar";
import { useVortexUI } from "@/hooks/useVortexUI";
import {
  WeatherWidget, TimeWidget, TasksWidget, HealthWidget, MusicWidget,
  PCHealthWidget, CalendarWidget, NewsWidget, MarketsWidget, FocusWidget,
} from "@/components/vortex/widgets";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const { userName } = useVortexUI();
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col items-center text-center mb-8 animate-fade-up">
        <div className="hud-label mb-2">VORTEX · SYS.READY</div>
        <h1 className="text-3xl sm:text-4xl text-cream font-light tracking-tight">
          Welcome back, <span className="text-cream">{userName}</span>.
        </h1>
        <p className="text-xs text-muted-foreground mt-2 tracking-widest uppercase">All systems nominal</p>
      </div>

      <div className="flex justify-center mb-8 animate-float">
        <NeuralOrb size={340} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-24">
        <TimeWidget />
        <WeatherWidget />
        <TasksWidget />
        <HealthWidget />
        <MusicWidget />
        <PCHealthWidget />
        <CalendarWidget />
        <FocusWidget />
        <NewsWidget />
        <MarketsWidget />
      </div>

      <div className="fixed bottom-6 left-0 right-0 flex justify-center px-4 z-40">
        <VoiceBar />
      </div>
    </div>
  );
}
