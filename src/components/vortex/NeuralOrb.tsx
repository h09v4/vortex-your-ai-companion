interface Props {
  size?: number;
  className?: string;
}

export function NeuralOrb({ size = 320, className = "" }: Props) {
  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ animation: "orb-rotate 60s linear infinite" }}
      >
        <img
          src="/orb.png"
          alt=""
          style={{
            width: size,
            height: size,
            objectFit: "contain",
            background: "transparent",
            filter:
              "drop-shadow(0 0 40px rgba(180,200,235,0.5)) drop-shadow(0 0 90px rgba(160,185,225,0.3))",
          }}
        />
      </div>
    </div>
  );
}
