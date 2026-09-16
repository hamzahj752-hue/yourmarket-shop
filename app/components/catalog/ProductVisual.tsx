type ProductVisualProps = {
  category: string;
  color: string;
};

const GARMENT_OUTLINE = "#3f3f46";

export default function ProductVisual({
  category,
  color,
}: ProductVisualProps) {
  const uid = `${category}-${color.replace("#", "")}`;
  const highlightId = `pv-highlight-${uid}`;
  const lensId = `pv-lens-${uid}`;

  return (
    <svg
      viewBox="0 0 240 300"
      className="h-auto w-full max-w-[190px] transition-transform duration-300 group-hover:scale-105"
      role="img"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={highlightId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.12" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={lensId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a3e635" stopOpacity="0.22" />
          <stop offset="1" stopColor="#18181b" stopOpacity="0.5" />
        </linearGradient>
      </defs>

      {category === "t-shirts" && (
        <g>
          <path
            d="M120 18 L78 44 L64 72 L86 84 L86 282 H154 L154 84 L176 72 L162 44 Z"
            fill={color}
            stroke={GARMENT_OUTLINE}
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <path
            d="M120 18 L78 44 L64 72 L86 84 L86 282 H154 L154 84 L176 72 L162 44 Z"
            fill={`url(#${highlightId})`}
          />
          <line
            x1="120"
            y1="96"
            x2="120"
            y2="268"
            stroke="#a3e635"
            strokeWidth="3"
            strokeDasharray="1 7"
            strokeLinecap="round"
            opacity="0.8"
          />
        </g>
      )}

      {category === "pants" && (
        <g>
          <path
            d="M96 30 H144 V120 L158 274 L122 280 L120 172 L118 280 L82 274 L96 120 Z"
            fill={color}
            stroke={GARMENT_OUTLINE}
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <path
            d="M96 30 H144 V120 L158 274 L122 280 L120 172 L118 280 L82 274 L96 120 Z"
            fill={`url(#${highlightId})`}
          />
          <line
            x1="120"
            y1="42"
            x2="120"
            y2="268"
            stroke="#a3e635"
            strokeWidth="3"
            strokeDasharray="1 7"
            strokeLinecap="round"
            opacity="0.8"
          />
        </g>
      )}

      {category === "shirts-jackets" && (
        <g>
          <path
            d="M46 30 L80 14 H160 L194 30 L180 54 L160 44 V284 H80 V44 L60 54 Z"
            fill={color}
            stroke={GARMENT_OUTLINE}
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <path
            d="M46 30 L80 14 H160 L194 30 L180 54 L160 44 V284 H80 V44 L60 54 Z"
            fill={`url(#${highlightId})`}
          />
          <line
            x1="120"
            y1="60"
            x2="120"
            y2="270"
            stroke="#a3e635"
            strokeWidth="3"
            strokeDasharray="1 7"
            strokeLinecap="round"
            opacity="0.8"
          />
        </g>
      )}

      {category === "sunglasses" && (
        <g>
          <circle
            cx="86"
            cy="150"
            r="54"
            fill={`url(#${lensId})`}
            stroke={color}
            strokeWidth="10"
          />
          <circle
            cx="154"
            cy="150"
            r="54"
            fill={`url(#${lensId})`}
            stroke={color}
            strokeWidth="10"
          />
          <path
            d="M112 146 Q120 134 128 146"
            fill="none"
            stroke={color}
            strokeWidth="9"
            strokeLinecap="round"
          />
          <line
            x1="32"
            y1="146"
            x2="18"
            y2="138"
            stroke={color}
            strokeWidth="9"
            strokeLinecap="round"
          />
          <line
            x1="208"
            y1="146"
            x2="222"
            y2="138"
            stroke={color}
            strokeWidth="9"
            strokeLinecap="round"
          />
          <circle cx="120" cy="244" r="5" fill="#a3e635" />
          <line
            x1="98"
            y1="244"
            x2="110"
            y2="244"
            stroke="#a3e635"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <line
            x1="130"
            y1="244"
            x2="142"
            y2="244"
            stroke="#a3e635"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>
      )}
    </svg>
  );
}