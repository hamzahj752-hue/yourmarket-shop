import { useId } from "react";

type ShoeVisualProps = {
  accent?: string;
  color?: string;
  className?: string;
  label?: string;
};

function hexToRgb(hex: string): [number, number, number] {
  const value = hex.replace("#", "");
  const parsed = parseInt(value ?? "", 16);
  if ((value?.length ?? 0) < 6 || Number.isNaN(parsed)) {
    return [18, 18, 20];
  }
  return [
    (parsed >> 16) & 255,
    (parsed >> 8) & 255,
    parsed & 255,
  ];
}

function mixWith(hex: string, other: string, amount: number): string {
  const a = hexToRgb(hex);
  const b = hexToRgb(other);
  const mixed = a.map((channel, index) =>
    Math.round(channel + (b[index] - channel) * amount),
  );
  return `#${mixed.map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}

function shade(hex: string, amount: number): string {
  return amount >= 0
    ? mixWith(hex, "#000000", amount)
    : mixWith(hex, "#ffffff", -amount);
}

export default function ShoeVisual({
  accent = "#a3e635",
  color,
  className = "",
  label = "Stylized premium sneaker illustration",
}: ShoeVisualProps) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");

  const glowId = `glow-${id}`;
  const shadowId = `shadow-${id}`;
  const soleId = `sole-${id}`;
  const bodyId = `body-${id}`;
  const panelId = `panel-${id}`;
  const tintId = `tint-${id}`;
  const sheenId = `sheen-${id}`;
  const softBlur = `soft-${id}`;

  const hasTint = Boolean(color);

  return (
    <svg
      viewBox="0 0 320 190"
      className={className}
      role="img"
      aria-label={label}
    >
      <defs>
        <radialGradient id={glowId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.55" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={shadowId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={soleId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3d3d42" />
          <stop offset="100%" stopColor="#1a1a1d" />
        </linearGradient>
        <linearGradient id={bodyId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2c2c31" />
          <stop offset="100%" stopColor="#141416" />
        </linearGradient>
        <linearGradient id={tintId} x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor={shade(color ?? accent, 0.38)} />
          <stop offset="55%" stopColor={color ?? "#2c2c31"} />
          <stop offset="100%" stopColor={shade(color ?? accent, -0.22)} />
        </linearGradient>
        <linearGradient id={sheenId} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={panelId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.95" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.35" />
        </linearGradient>
        <filter id={softBlur} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="12" />
        </filter>
      </defs>

      <ellipse cx="160" cy="120" rx="150" ry="72" fill={`url(#${glowId})`} />
      <ellipse
        cx="158"
        cy="168"
        rx="128"
        ry="12"
        fill={`url(#${shadowId})`}
        filter={`url(#${softBlur})`}
      />

      <path
        d="M42 138
           H234
           C248 138 258 146 258 158
           C258 170 250 176 236 176
           H62
           C48 176 42 168 42 156
           C42 148 42 143 42 138 Z"
        fill={`url(#${soleId})`}
      />
      <path
        d="M42 138
           H234
           C248 138 258 146 258 158
           C258 170 250 176 236 176
           H62
           C48 176 42 168 42 156
           C42 148 42 143 42 138 Z"
        fill="none"
        stroke={`${accent}33`}
        strokeWidth="1.5"
      />

      <path
        d="M48 136 H236 Q248 136 254 144"
        fill="none"
        stroke={`url(#${panelId})`}
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.7"
      />

      <path
        d="M58 78
           C70 58 96 50 126 54
           C160 58 192 72 214 84
           C238 96 254 106 258 122
           C260 132 254 142 244 144
           L66 144
           C56 144 50 136 52 122
           C54 106 56 90 58 78 Z"
        fill={`url(#${hasTint ? tintId : bodyId})`}
      />
      <path
        d="M58 78
           C70 58 96 50 126 54
           C160 58 192 72 214 84
           C238 96 254 106 258 122"
        fill="none"
        stroke={hasTint ? shade(color ?? accent, 0.55) : "#17171a"}
        strokeWidth="4"
      />

      {hasTint && (
        <path
          d="M58 78
             C70 58 96 50 126 54
             C160 58 192 72 214 84
             C238 96 254 106 258 122
             C260 132 254 142 244 144
             L66 144
             C56 144 50 136 52 122
             C54 106 56 90 58 78 Z"
          fill={`url(#${sheenId})`}
          opacity="0.35"
        />
      )}

      <path
        d="M60 78 C52 96 50 112 56 126"
        fill="none"
        stroke="#3f3f46"
        strokeWidth="4"
        strokeLinecap="round"
      />

      <path
        d="M88 60 C102 58 110 64 108 72 C106 79 92 82 81 77 C72 73 74 62 88 60 Z"
        fill="#0d0d0f"
        stroke="#3f3f46"
        strokeWidth="2"
      />

      <path
        d="M136 62 L142 68 M154 66 L160 74 M172 72 L178 81 M190 79 L196 88"
        stroke="#52525b"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      <path
        d="M52 122 C92 102 138 96 182 104 C214 110 242 104 260 88"
        fill="none"
        stroke={`url(#${panelId})`}
        strokeWidth="5"
        strokeLinecap="round"
        filter={`url(#${softBlur})`}
        opacity="0.55"
      />
      <path
        d="M52 122 C92 102 138 96 182 104 C214 110 242 104 260 88"
        fill="none"
        stroke={`url(#${panelId})`}
        strokeWidth="5"
        strokeLinecap="round"
      />

      <path
        d="M74 128 H220"
        stroke={`${accent}59`}
        strokeWidth="2"
        strokeDasharray="3 7"
        strokeLinecap="round"
      />
    </svg>
  );
}