/**
 * Shared presentation engine for Product Details.
 *
 * Both the Shoes and the Premium editorial Product Details layouts derive
 * their per-variant full-page theme from this module, so Admin can later
 * override any value on the PRODUCT / VARIANT mock fields without touching
 * code. Only fixed, safe presets are exposed — Admin can never inject
 * arbitrary CSS.
 */

export type BackgroundTextStyle =
  | "bold"
  | "condensed"
  | "wide"
  | "outline"
  | "soft"
  | "minimal";

export type BackgroundTextPreset = {
  label: string;
  className: string;
  letterSpacing: string;
  fontWeight: number;
  opacity: number;
  stroke?: boolean;
};

export const BACKGROUND_TEXT_STYLES: Record<
  BackgroundTextStyle,
  BackgroundTextPreset
> = {
  bold: {
    label: "Bold",
    className: "font-black uppercase",
    letterSpacing: "-0.02em",
    fontWeight: 900,
    opacity: 1,
  },
  condensed: {
    label: "Condensed",
    className: "font-black uppercase",
    letterSpacing: "-0.08em",
    fontWeight: 900,
    opacity: 1,
  },
  wide: {
    label: "Wide",
    className: "font-bold uppercase",
    letterSpacing: "0.3em",
    fontWeight: 700,
    opacity: 0.9,
  },
  outline: {
    label: "Outline",
    className: "font-black uppercase",
    letterSpacing: "0.01em",
    fontWeight: 900,
    opacity: 1,
    stroke: true,
  },
  soft: {
    label: "Soft",
    className: "font-bold lowercase",
    letterSpacing: "0.16em",
    fontWeight: 700,
    opacity: 0.75,
  },
  minimal: {
    label: "Minimal",
    className: "font-semibold uppercase",
    letterSpacing: "0.44em",
    fontWeight: 600,
    opacity: 0.65,
  },
};

export function hexToRgb(hex: string): [number, number, number] {
  const value = hex.replace("#", "");
  const parsed = parseInt(value ?? "", 16);
  if ((value?.length ?? 0) < 6 || Number.isNaN(parsed)) return [18, 18, 20];
  return [(parsed >> 16) & 255, (parsed >> 8) & 255, parsed & 255];
}

export function mixWith(hex: string, other: string, amount: number): string {
  const a = hexToRgb(hex);
  const b = hexToRgb(other);
  const mixed = a.map((ch, i) => Math.round(ch + (b[i] - ch) * amount));
  return `#${mixed.map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}

export function shade(hex: string, amount: number): string {
  return amount >= 0
    ? mixWith(hex, "#000000", amount)
    : mixWith(hex, "#ffffff", -amount);
}

/** Relative luminance (0..1) of a hex color — used to pick readable text colors. */
export function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

/** Pick a human-friendly color name for a hex, used as the variant colorName default. */
const COLOR_NAMES: Record<string, string> = {
  "#18181b": "Black",
  "#1c1917": "Charcoal",
  "#1f2937": "Midnight Blue",
  "#27272a": "Midnight",
  "#292524": "Espresso",
  "#374151": "Iron",
  "#3f3f46": "Graphite",
  "#44403c": "Umber",
  "#4b5563": "Steel",
  "#52525b": "Zinc",
  "#525252": "Ash",
  "#57534e": "Stone",
  "#71717a": "Slate",
  "#78716c": "Taupe",
  "#a1a1aa": "Silver",
  "#a3e635": "Lime",
  "#a8a29e": "Sand",
  "#cbb26a": "Gold",
  "#e4e4e7": "Light Grey",
  "#e7e5e4": "Ivory",
  "#ececf1": "Cloud",
  "#f4f4f5": "Off-White",
  "#fafafa": "White",
};

export function hexColorName(hex: string): string {
  return COLOR_NAMES[hex.toLowerCase()] ?? hex;
}

export function backgroundWord(name: string): string {
  return name.split(" ")[0].toUpperCase();
}

/* ------------------------------------------------------------------ */
/* Shoes / high-energy theme                                           */
/* ------------------------------------------------------------------ */

export type ColorTheme = {
  heroBg: string;
  glow: string;
  ghost: string;
  text: string;
  accent: string;
  cta: string;
  ctaText: string;
  chip: string;
  chipBg: string;
  chipBorder: string;
  panelBorder: string;
  isLight: boolean;
};

export function getColorTheme(hex: string): ColorTheme {
  const [r, g, b] = hexToRgb(hex);
  const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const sat = max === 0 ? 0 : (max - min) / max;
  let hue = 0;
  if (max !== min) {
    const d = max - min;
    if (max === r) hue = ((g - b) / d + (g < b ? 6 : 0)) * 60;
    else if (max === g) hue = ((b - r) / d + 2) * 60;
    else hue = ((r - g) / d + 4) * 60;
  }

  // White / light neutrals → light grey hero theme
  if (lum > 0.6 && sat < 0.25) {
    return {
      heroBg: "#edeceb",
      glow: "#ffffff",
      ghost: "rgba(0, 0, 0, 0.07)",
      text: "#1c1c1f",
      accent: "#6b6b73",
      cta: "#1c1c1f",
      ctaText: "#ffffff",
      chip: "#52525b",
      chipBg: "rgba(0, 0, 0, 0.06)",
      chipBorder: "rgba(0, 0, 0, 0.1)",
      panelBorder: "rgba(0, 0, 0, 0.08)",
      isLight: true,
    };
  }

  // Blue tones → deep blue hero theme
  if (hue >= 180 && hue <= 260 && sat >= 0.35) {
    return {
      heroBg: "#0d1830",
      glow: "#3b82f6",
      ghost: "rgba(100, 148, 237, 0.1)",
      text: "#e0eaff",
      accent: "#8db0ff",
      cta: "#6b9dff",
      ctaText: "#000000",
      chip: "#a9c4ff",
      chipBg: "rgba(59, 130, 246, 0.15)",
      chipBorder: "rgba(126, 168, 255, 0.35)",
      panelBorder: "rgba(59, 130, 246, 0.2)",
      isLight: false,
    };
  }

  // Black / dark neutrals → charcoal hero theme
  if (lum < 0.22 && sat < 0.22) {
    return {
      heroBg: "#111113",
      glow: "#a1a1aa",
      ghost: "rgba(255, 255, 255, 0.06)",
      text: "#e4e4e7",
      accent: "#a1a1aa",
      cta: "#e4e4e7",
      ctaText: "#000000",
      chip: "#d4d4d8",
      chipBg: "rgba(255, 255, 255, 0.07)",
      chipBorder: "rgba(255, 255, 255, 0.12)",
      panelBorder: "rgba(255, 255, 255, 0.08)",
      isLight: false,
    };
  }

  // All other colors → hue-derived hero theme
  return {
    heroBg: shade(hex, 0.78),
    glow: hex,
    ghost: `${hex}14`,
    text: shade(hex, -0.45),
    accent: hex,
    cta: hex,
    ctaText: lum > 0.45 ? "#000000" : "#ffffff",
    chip: hex,
    chipBg: `${hex}22`,
    chipBorder: `${hex}44`,
    panelBorder: `${hex}25`,
    isLight: false,
  };
}

/* ------------------------------------------------------------------ */
/* Premium editorial theme                                             */
/* ------------------------------------------------------------------ */

export type EditorialTheme = {
  pageBg: string;
  cardBg: string;
  cardBorder: string;
  innerBorder: string;
  glowA: string;
  glowB: string;
  text: string;
  body: string;
  subtle: string;
  hairline: string;
  accent: string;
  accentSoft: string;
  cta: string;
  ctaText: string;
  ctaSoft: string;
  chipBg: string;
  chipText: string;
  chipBorder: string;
  ghost: string;
  isLight: boolean;
};

export function getEditorialTheme(hex: string): EditorialTheme {
  const [r, g, b] = hexToRgb(hex);
  const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const sat = max === 0 ? 0 : (max - min) / max;

  // White / light neutrals → soft, light editorial atmosphere
  if (lum > 0.62 && sat < 0.25) {
    return {
      pageBg: "#d7d4d1",
      cardBg: "#f4f3f1",
      cardBorder: "rgba(0, 0, 0, 0.1)",
      innerBorder: "rgba(0, 0, 0, 0.06)",
      glowA: "rgba(255, 255, 255, 0.75)",
      glowB: "rgba(0, 0, 0, 0.05)",
      text: "#1a1a1c",
      body: "#54545a",
      subtle: "#8a8a90",
      hairline: "rgba(0, 0, 0, 0.1)",
      accent: "#3d3d44",
      accentSoft: "rgba(0, 0, 0, 0.06)",
      cta: "#1a1a1c",
      ctaText: "#fafafa",
      ctaSoft: "rgba(0, 0, 0, 0.07)",
      chipBg: "rgba(255, 255, 255, 0.55)",
      chipText: "#3b3b40",
      chipBorder: "rgba(0, 0, 0, 0.14)",
      ghost: "rgba(0, 0, 0, 0.07)",
      isLight: true,
    };
  }

  // Very dark, low-saturation colors → charcoal or warm brown atmosphere
  if (lum < 0.22 && sat < 0.3) {
    const warmBias = r - b;
    if (warmBias > 4 && r >= g) {
      return {
        pageBg: "#171310",
        cardBg: "#211b15",
        cardBorder: "rgba(255, 255, 255, 0.06)",
        innerBorder: "rgba(255, 255, 255, 0.04)",
        glowA: "#7a5230",
        glowB: "rgba(120, 84, 50, 0.5)",
        text: "#efe6da",
        body: "#b3a793",
        subtle: "#857a69",
        hairline: "rgba(255, 255, 255, 0.09)",
        accent: "#e9cba1",
        accentSoft: "rgba(233, 203, 161, 0.12)",
        cta: "#e9cba1",
        ctaText: "#201507",
        ctaSoft: "rgba(255, 255, 255, 0.05)",
        chipBg: "rgba(255, 255, 255, 0.07)",
        chipText: "#d9cdbc",
        chipBorder: "rgba(255, 255, 255, 0.14)",
        ghost: "rgba(255, 255, 255, 0.06)",
        isLight: false,
      };
    }
    return {
      pageBg: "#0c0c0e",
      cardBg: "#141416",
      cardBorder: "rgba(255, 255, 255, 0.07)",
      innerBorder: "rgba(255, 255, 255, 0.04)",
      glowA: "rgba(160, 160, 170, 0.5)",
      glowB: "rgba(110, 110, 125, 0.38)",
      text: "#e9e9ec",
      body: "#9d9da4",
      subtle: "#717178",
      hairline: "rgba(255, 255, 255, 0.08)",
      accent: "#c9c9d0",
      accentSoft: "rgba(255, 255, 255, 0.09)",
      cta: "#efeff2",
      ctaText: "#0b0b0c",
      ctaSoft: "rgba(255, 255, 255, 0.05)",
      chipBg: "rgba(255, 255, 255, 0.07)",
      chipText: "#d6d6dc",
      chipBorder: "rgba(255, 255, 255, 0.15)",
      ghost: "rgba(255, 255, 255, 0.05)",
      isLight: false,
    };
  }

  // Everything else → tinted dark atmosphere derived from the color
  const cta = lum > 0.5 ? hex : mixWith(hex, "#ffffff", 0.25);
  return {
    pageBg: shade(hex, 0.84),
    cardBg: shade(hex, 0.8),
    cardBorder: `${hex}30`,
    innerBorder: `${hex}16`,
    glowA: `${hex}75`,
    glowB: `${hex}50`,
    text: mixWith(hex, "#ffffff", 0.84),
    body: mixWith(mixWith(hex, "#ffffff", 0.6), "#9ca3af", 0.35),
    subtle: mixWith(mixWith(hex, "#ffffff", 0.48), "#6b7280", 0.4),
    hairline: `${hex}42`,
    accent: lum > 0.5 ? hex : mixWith(hex, "#ffffff", 0.25),
    accentSoft: `${hex}33`,
    cta,
    ctaText: relativeLuminance(cta) > 0.5 ? "#0b0b0c" : "#ffffff",
    ctaSoft: `${hex}1f`,
    chipBg: `${hex}24`,
    chipText: mixWith(hex, "#ffffff", 0.8),
    chipBorder: `${hex}45`,
    ghost: `${hex}30`,
    isLight: false,
  };
}

/* ------------------------------------------------------------------ */
/* Admin-ready variant presentation                                    */
/* ------------------------------------------------------------------ */

export type ProductVariant = {
  colorName: string;
  colorValue: string;
  image?: string;
  themeColor: string;
  accentColor: string;
  textColor: string;
  backgroundTextColor: string;
};

export function resolveVariant(hex: string, name?: string): ProductVariant {
  const theme = getColorTheme(hex);
  return {
    colorName: name ?? hexColorName(hex),
    colorValue: hex,
    image: "",
    themeColor: theme.heroBg,
    accentColor: theme.accent,
    textColor: theme.text,
    backgroundTextColor: theme.ghost,
  };
}