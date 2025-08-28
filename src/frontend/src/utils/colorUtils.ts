/**
 * Color Utilities
 * Utility functions for color manipulation and operations
 */

/**
 * Color representation interface
 */
export interface Color {
  r: number;
  g: number;
  b: number;
  a?: number;
}

/**
 * HSL color representation
 */
export interface HSL {
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
  a?: number; // 0-1
}

/**
 * HSV color representation
 */
export interface HSV {
  h: number; // 0-360
  s: number; // 0-100
  v: number; // 0-100
  a?: number; // 0-1
}

/**
 * Converts hex color to RGB
 */
export const hexToRgb = (hex: string): Color => {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substr(0, 2), 16);
  const g = parseInt(cleanHex.substr(2, 2), 16);
  const b = parseInt(cleanHex.substr(4, 2), 16);
  
  return { r, g, b };
};

/**
 * Converts RGB to hex color
 */
export const rgbToHex = (r: number, g: number, b: number): string => {
  const toHex = (n: number) => {
    const hex = Math.round(n).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

/**
 * Converts RGB to HSL
 */
export const rgbToHsl = (r: number, g: number, b: number): HSL => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
};

/**
 * Converts HSL to RGB
 */
export const hslToRgb = (h: number, s: number, l: number): Color => {
  h /= 360;
  s /= 100;
  l /= 100;

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
};

/**
 * Converts RGB to HSV
 */
export const rgbToHsv = (r: number, g: number, b: number): HSV => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;

  if (max !== min) {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    v: Math.round(v * 100)
  };
};

/**
 * Converts HSV to RGB
 */
export const hsvToRgb = (h: number, s: number, v: number): Color => {
  h /= 360;
  s /= 100;
  v /= 100;

  let r = 0, g = 0, b = 0;

  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0:
      r = v; g = t; b = p;
      break;
    case 1:
      r = q; g = v; b = p;
      break;
    case 2:
      r = p; g = v; b = t;
      break;
    case 3:
      r = p; g = q; b = v;
      break;
    case 4:
      r = t; g = p; b = v;
      break;
    case 5:
      r = v; g = p; b = q;
      break;
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
};

/**
 * Calculates the luminance of a color
 */
export const getLuminance = (r: number, g: number, b: number): number => {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

/**
 * Calculates the contrast ratio between two colors
 */
export const getContrastRatio = (color1: Color, color2: Color): number => {
  const lum1 = getLuminance(color1.r, color1.g, color1.b);
  const lum2 = getLuminance(color2.r, color2.g, color2.b);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
};

/**
 * Checks if a color is light or dark
 */
export const isLight = (r: number, g: number, b: number): boolean => {
  const luminance = getLuminance(r, g, b);
  return luminance > 0.5;
};

/**
 * Checks if a color is dark
 */
export const isDark = (r: number, g: number, b: number): boolean => {
  return !isLight(r, g, b);
};

/**
 * Gets the best text color (black or white) for a background color
 */
export const getBestTextColor = (r: number, g: number, b: number): Color => {
  return isLight(r, g, b) ? { r: 0, g: 0, b: 0 } : { r: 255, g: 255, b: 255 };
};

/**
 * Lightens a color by a percentage
 */
export const lighten = (r: number, g: number, b: number, percent: number): Color => {
  const hsl = rgbToHsl(r, g, b);
  hsl.l = Math.min(100, hsl.l + percent);
  return hslToRgb(hsl.h, hsl.s, hsl.l);
};

/**
 * Darkens a color by a percentage
 */
export const darken = (r: number, g: number, b: number, percent: number): Color => {
  const hsl = rgbToHsl(r, g, b);
  hsl.l = Math.max(0, hsl.l - percent);
  return hslToRgb(hsl.h, hsl.s, hsl.l);
};

/**
 * Saturates a color by a percentage
 */
export const saturate = (r: number, g: number, b: number, percent: number): Color => {
  const hsl = rgbToHsl(r, g, b);
  hsl.s = Math.min(100, hsl.s + percent);
  return hslToRgb(hsl.h, hsl.s, hsl.l);
};

/**
 * Desaturates a color by a percentage
 */
export const desaturate = (r: number, g: number, b: number, percent: number): Color => {
  const hsl = rgbToHsl(r, g, b);
  hsl.s = Math.max(0, hsl.s - percent);
  return hslToRgb(hsl.h, hsl.s, hsl.l);
};

/**
 * Adjusts the hue of a color
 */
export const adjustHue = (r: number, g: number, b: number, degrees: number): Color => {
  const hsl = rgbToHsl(r, g, b);
  hsl.h = (hsl.h + degrees) % 360;
  if (hsl.h < 0) hsl.h += 360;
  return hslToRgb(hsl.h, hsl.s, hsl.l);
};

/**
 * Creates a complementary color
 */
export const complement = (r: number, g: number, b: number): Color => {
  return adjustHue(r, g, b, 180);
};

/**
 * Creates an analogous color palette
 */
export const analogous = (r: number, g: number, b: number, count = 3): Color[] => {
  const hsl = rgbToHsl(r, g, b);
  const colors: Color[] = [];
  const step = 30 / (count - 1);

  for (let i = 0; i < count; i++) {
    const hue = (hsl.h + i * step) % 360;
    colors.push(hslToRgb(hue, hsl.s, hsl.l));
  }

  return colors;
};

/**
 * Creates a triadic color palette
 */
export const triadic = (r: number, g: number, b: number): Color[] => {
  const hsl = rgbToHsl(r, g, b);
  return [
    hslToRgb(hsl.h, hsl.s, hsl.l),
    hslToRgb((hsl.h + 120) % 360, hsl.s, hsl.l),
    hslToRgb((hsl.h + 240) % 360, hsl.s, hsl.l)
  ];
};

/**
 * Creates a tetradic color palette
 */
export const tetradic = (r: number, g: number, b: number): Color[] => {
  const hsl = rgbToHsl(r, g, b);
  return [
    hslToRgb(hsl.h, hsl.s, hsl.l),
    hslToRgb((hsl.h + 90) % 360, hsl.s, hsl.l),
    hslToRgb((hsl.h + 180) % 360, hsl.s, hsl.l),
    hslToRgb((hsl.h + 270) % 360, hsl.s, hsl.l)
  ];
};

/**
 * Creates a monochromatic color palette
 */
export const monochromatic = (r: number, g: number, b: number, count = 5): Color[] => {
  const hsl = rgbToHsl(r, g, b);
  const colors: Color[] = [];
  const step = 100 / (count - 1);

  for (let i = 0; i < count; i++) {
    const lightness = Math.max(0, Math.min(100, i * step));
    colors.push(hslToRgb(hsl.h, hsl.s, lightness));
  }

  return colors;
};

/**
 * Mixes two colors by a given weight
 */
export const mix = (color1: Color, color2: Color, weight = 0.5): Color => {
  const w = Math.max(0, Math.min(1, weight));
  return {
    r: Math.round(color1.r * (1 - w) + color2.r * w),
    g: Math.round(color1.g * (1 - w) + color2.g * w),
    b: Math.round(color1.b * (1 - w) + color2.b * w)
  };
};

/**
 * Creates a gradient between two colors
 */
export const gradient = (color1: Color, color2: Color, steps = 10): Color[] => {
  const colors: Color[] = [];
  for (let i = 0; i < steps; i++) {
    const weight = i / (steps - 1);
    colors.push(mix(color1, color2, weight));
  }
  return colors;
};

/**
 * Converts a color to grayscale
 */
export const grayscale = (r: number, g: number, b: number): Color => {
  const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
  return { r: gray, g: gray, b: gray };
};

/**
 * Inverts a color
 */
export const invert = (r: number, g: number, b: number): Color => {
  return {
    r: 255 - r,
    g: 255 - g,
    b: 255 - b
  };
};

/**
 * Applies a sepia filter to a color
 */
export const sepia = (r: number, g: number, b: number): Color => {
  return {
    r: Math.min(255, Math.round((r * 0.393) + (g * 0.769) + (b * 0.189))),
    g: Math.min(255, Math.round((r * 0.349) + (g * 0.686) + (b * 0.168))),
    b: Math.min(255, Math.round((r * 0.272) + (g * 0.534) + (b * 0.131)))
  };
};

/**
 * Validates if a hex color is valid
 */
export const isValidHex = (hex: string): boolean => {
  const hexRegex = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexRegex.test(hex);
};

/**
 * Validates if RGB values are valid
 */
export const isValidRgb = (r: number, g: number, b: number): boolean => {
  return r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255;
};

/**
 * Formats a color as CSS rgb() string
 */
export const toRgbString = (r: number, g: number, b: number, a?: number): string => {
  if (a !== undefined) {
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }
  return `rgb(${r}, ${g}, ${b})`;
};

/**
 * Formats a color as CSS hsl() string
 */
export const toHslString = (h: number, s: number, l: number, a?: number): string => {
  if (a !== undefined) {
    return `hsla(${h}, ${s}%, ${l}%, ${a})`;
  }
  return `hsl(${h}, ${s}%, ${l}%)`;
};

/**
 * Predefined color palettes
 */
export const colorPalettes = {
  // Material Design Colors
  material: {
    red: ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'],
    blue: ['#e3f2fd', '#bbdefb', '#90caf9', '#64b5f6', '#42a5f5', '#2196f3', '#1e88e5', '#1976d2', '#1565c0', '#0d47a1'],
    green: ['#e8f5e8', '#c8e6c9', '#a5d6a7', '#81c784', '#66bb6a', '#4caf50', '#43a047', '#388e3c', '#2e7d32', '#1b5e20'],
    gray: ['#fafafa', '#f5f5f5', '#eeeeee', '#e0e0e0', '#bdbdbd', '#9e9e9e', '#757575', '#616161', '#424242', '#212121']
  },
  
  // Tailwind CSS Colors
  tailwind: {
    red: ['#fef2f2', '#fee2e2', '#fecaca', '#fca5a5', '#f87171', '#ef4444', '#dc2626', '#b91c1c', '#991b1b', '#7f1d1d'],
    blue: ['#eff6ff', '#dbeafe', '#bfdbfe', '#93c5fd', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af', '#1e3a8a'],
    green: ['#f0fdf4', '#dcfce7', '#bbf7d0', '#86efac', '#4ade80', '#22c55e', '#16a34a', '#15803d', '#166534', '#14532d'],
    gray: ['#f9fafb', '#f3f4f6', '#e5e7eb', '#d1d5db', '#9ca3af', '#6b7280', '#4b5563', '#374151', '#1f2937', '#111827']
  },
  
  // Security-themed colors
  security: {
    critical: ['#dc2626', '#b91c1c', '#991b1b', '#7f1d1d'],
    high: ['#ea580c', '#c2410c', '#9a3412', '#7c2d12'],
    medium: ['#d97706', '#b45309', '#92400e', '#78350f'],
    low: ['#059669', '#047857', '#065f46', '#064e3b'],
    info: ['#2563eb', '#1d4ed8', '#1e40af', '#1e3a8a']
  }
};

/**
 * Gets a color from a predefined palette
 */
export const getPaletteColor = (palette: string, category: string, index: number): string => {
  const palettes = colorPalettes as any;
  if (palettes[palette] && palettes[palette][category]) {
    const colors = palettes[palette][category];
    return colors[index % colors.length];
  }
  return '#000000';
}; 