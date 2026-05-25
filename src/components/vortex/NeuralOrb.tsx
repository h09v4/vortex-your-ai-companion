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
    const orbRadius = size * 0.42;

    type Particle = {
      angle: number;
      radius: number;
      speed: number;
      size: number;
      alpha: number;
      drift: number;
    };
    const particles: Particle[] = Array.from({ length: 110 }, () => ({
      angle: Math.random() * Math.PI * 2,
      radius: orbRadius * (1.05 + Math.random() * 0.8),
      speed: (Math.random() < 0.5 ? -1 : 1) * (0.001 + Math.random() * 0.004),
      size: 0.4 + Math.random() * 1.6,
      alpha: 0.2 + Math.random() * 0.7,
      drift: Math.random() * Math.PI * 2,
    }));

    let raf = 0;
    let t = 0;

    const draw = () => {
      t += 1;
      ctx.clearRect(0, 0, size, size);

      // soft outer halo (cool white rim glow)
      const halo = ctx.createRadialGradient(cx, cy, orbRadius * 0.85, cx, cy, orbRadius * 1.8);
      halo.addColorStop(0, "rgba(200, 215, 235, 0.22)");
      halo.addColorStop(0.5, "rgba(180, 200, 230, 0.06)");
      halo.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, size, size);

      // particles / stardust
      for (const p of particles) {
        p.angle += p.speed;
        p.drift += 0.01;
        const r = p.radius + Math.sin(p.drift) * 5;
        const x = cx + Math.cos(p.angle) * r;
        const y = cy + Math.sin(p.angle) * r;
        const a = p.alpha * (0.6 + 0.4 * Math.sin(p.drift * 1.3));
        ctx.fillStyle = `rgba(220, 230, 245, ${a})`;
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(200, 220, 245, ${a * 0.12})`;
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
      <canvas
        ref={canvasRef}
        style={{ width: size, height: size }}
        className="absolute inset-0 pointer-events-none"
      />
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ animation: "orb-rotate 60s linear infinite" }}
      >
        <img
          src="/orb.jpg"
          alt=""
          style={{
            width: size,
            height: size,
            objectFit: "cover",
            background: "transparent",
            border: "none",
            outline: "none",
            mixBlendMode: "lighten",
            WebkitMaskImage:
              "radial-gradient(circle at center, #000 38%, rgba(0,0,0,0.6) 48%, transparent 58%)",
            maskImage:
              "radial-gradient(circle at center, #000 38%, rgba(0,0,0,0.6) 48%, transparent 58%)",
            filter:
              "contrast(1.15) brightness(1.1) drop-shadow(0 0 40px rgba(180,200,235,0.45)) drop-shadow(0 0 90px rgba(160,185,225,0.3))",
          }}
        />

      </div>
    </div>
  );
}
