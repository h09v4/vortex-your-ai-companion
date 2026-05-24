import { useVortexUI } from "@/hooks/useVortexUI";

export function Background() {
  const { backgroundUrl } = useVortexUI();
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-background">
      {backgroundUrl && (
        <video
          key={backgroundUrl}
          src={backgroundUrl}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
      )}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,248,220,0.06),transparent_60%)]" />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
    </div>
  );
}
