import { useEffect, useRef } from "react";

interface Props {
  size?: number;
  className?: string;
}

export function NeuralOrb({ size = 320, className = "" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const orbRadius = size * 0.32;

    type Particle = {
      angle: number;
      radius: number;
      speed: number;
      size: number;
      alpha: number;
      drift: number;
    };
    const particles: Particle[] = Array.from({ length: 80 }, () => ({
      angle: Math.random() * Math.PI * 2,
      radius: orbRadius * (1.1 + Math.random() * 0.9),
      speed: (Math.random() < 0.5 ? -1 : 1) * (0.001 + Math.random() * 0.004),
      size: 0.5 + Math.random() * 1.8,
      alpha: 0.2 + Math.random() * 0.6,
      drift: Math.random() * Math.PI * 2,
    }));

    let raf = 0;
    let t = 0;

    const draw = () => {
      t += 1;
      ctx.clearRect(0, 0, size, size);

      // outer halo glow behind the orb
      const halo = ctx.createRadialGradient(cx, cy, orbRadius * 0.4, cx, cy, orbRadius * 2.2);
      halo.addColorStop(0, "rgba(255, 248, 220, 0.28)");
      halo.addColorStop(0.4, "rgba(255, 248, 220, 0.08)");
      halo.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, size, size);

      // rotating outer rings
      ctx.strokeStyle = "rgba(255, 248, 220, 0.18)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, orbRadius * 1.35, t * 0.006, t * 0.006 + Math.PI * 1.4);
      ctx.stroke();
      ctx.strokeStyle = "rgba(255, 248, 220, 0.1)";
      ctx.beginPath();
      ctx.arc(cx, cy, orbRadius * 1.55, -t * 0.004, -t * 0.004 + Math.PI * 1.1);
      ctx.stroke();

      // particles orbiting
      for (const p of particles) {
        p.angle += p.speed;
        p.drift += 0.01;
        const r = p.radius + Math.sin(p.drift) * 4;
        const x = cx + Math.cos(p.angle) * r;
        const y = cy + Math.sin(p.angle) * r;
        const a = p.alpha * (0.6 + 0.4 * Math.sin(p.drift * 1.3));
        ctx.fillStyle = `rgba(255, 248, 220, ${a})`;
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fill();
        // tiny trail glow
        ctx.fillStyle = `rgba(255, 248, 220, ${a * 0.15})`;
        ctx.beginPath();
        ctx.arc(x, y, p.size * 3, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [size]);

  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      {/* particle + glow canvas */}
      <canvas
        ref={canvasRef}
        style={{ width: size, height: size }}
        className="absolute inset-0 pointer-events-none"
      />
      {/* rotating orb video */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ animation: "orb-rotate 24s linear infinite" }}
      >
        <video
          src="/orb.mp4"
          autoPlay
          loop
          muted
          playsInline
          style={{
            width: size * 0.7,
            height: size * 0.7,
            borderRadius: "50%",
            objectFit: "cover",
            filter:
              "drop-shadow(0 0 30px rgba(255,248,220,0.55)) drop-shadow(0 0 80px rgba(255,248,220,0.35))",
            mixBlendMode: "screen",
          }}
        />
      </div>
    </div>
  );
}
