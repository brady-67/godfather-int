interface LiquidWaveProps {
  className?: string;
  flip?: boolean;
  gradientId: string;
  fromColor?: string;
  toColor?: string;
}

export function LiquidWave({
  className = '',
  flip = false,
  gradientId,
  fromColor = '#F6E08A',
  toColor = '#C48B1F',
}: LiquidWaveProps) {
  const transform = flip ? 'scale(1,-1)' : undefined;

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 140"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute left-0 w-full ${className}`}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor={fromColor} stopOpacity="0.55" />
          <stop offset="55%" stopColor={toColor} stopOpacity="0.35" />
          <stop offset="100%" stopColor={fromColor} stopOpacity="0.5" />
        </linearGradient>
      </defs>
      <g transform={transform}>
        <path fill={`url(#${gradientId})`}>
          <animate
            attributeName="d"
            dur="9s"
            repeatCount="indefinite"
            values="M0,70 C240,130 480,10 720,70 C960,130 1200,20 1440,70 L1440,140 L0,140 Z;M0,90 C300,20 540,120 760,62 C980,10 1200,110 1440,50 L1440,140 L0,140 Z;M0,70 C240,130 480,10 720,70 C960,130 1200,20 1440,70 L1440,140 L0,140 Z"
          />
        </path>
        <path fill={`url(#${gradientId})`} fillOpacity="0.6">
          <animate
            attributeName="d"
            dur="13s"
            repeatCount="indefinite"
            values="M0,100 C200,40 460,140 700,96 C940,52 1180,132 1440,88 L1440,140 L0,140 Z;M0,80 C260,130 520,30 760,84 C1000,138 1220,40 1440,96 L1440,140 L0,140 Z;M0,100 C200,40 460,140 700,96 C940,52 1180,132 1440,88 L1440,140 L0,140 Z"
          />
        </path>
      </g>
    </svg>
  );
}
