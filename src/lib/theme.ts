export type ThemeDef = {
  name: string;
  colors: [string, string, string];
  vars: Record<string, string>;
  darkVars: Record<string, string>;
};

export const themes: ThemeDef[] = [
  {
    name: "Sakura",
    colors: ["oklch(0.86 0.10 350)", "oklch(0.82 0.09 295)", "oklch(0.86 0.09 200)"],
    vars: {
      "--primary": "oklch(0.78 0.13 350)",
      "--primary-glow": "oklch(0.86 0.10 350)",
      "--secondary": "oklch(0.82 0.09 295)",
      "--accent": "oklch(0.86 0.09 200)",
      "--ring": "oklch(0.78 0.13 350)",
      "--gradient-primary":
        "linear-gradient(135deg, oklch(0.82 0.12 350), oklch(0.82 0.12 295))",
      "--gradient-cozy":
        "linear-gradient(135deg, oklch(0.95 0.04 350), oklch(0.95 0.04 295) 50%, oklch(0.95 0.04 200))",
    },
    darkVars: {
      "--primary": "oklch(0.82 0.12 350)",
      "--primary-glow": "oklch(0.70 0.15 350)",
      "--secondary": "oklch(0.42 0.08 295)",
      "--accent": "oklch(0.50 0.10 200)",
      "--ring": "oklch(0.82 0.12 350)",
      "--gradient-primary":
        "linear-gradient(135deg, oklch(0.70 0.15 350), oklch(0.60 0.15 295))",
      "--gradient-cozy":
        "linear-gradient(135deg, oklch(0.26 0.05 350), oklch(0.26 0.05 295) 50%, oklch(0.26 0.05 200))",
    },
  },
  {
    name: "Mint latte",
    colors: ["oklch(0.86 0.09 165)", "oklch(0.88 0.08 50)", "oklch(0.86 0.10 350)"],
    vars: {
      "--primary": "oklch(0.72 0.12 165)",
      "--primary-glow": "oklch(0.86 0.09 165)",
      "--secondary": "oklch(0.88 0.08 50)",
      "--accent": "oklch(0.86 0.10 350)",
      "--ring": "oklch(0.72 0.12 165)",
      "--gradient-primary":
        "linear-gradient(135deg, oklch(0.82 0.11 165), oklch(0.85 0.10 50))",
      "--gradient-cozy":
        "linear-gradient(135deg, oklch(0.95 0.04 165), oklch(0.96 0.04 50) 50%, oklch(0.95 0.04 350))",
    },
    darkVars: {
      "--primary": "oklch(0.75 0.13 165)",
      "--primary-glow": "oklch(0.60 0.13 165)",
      "--secondary": "oklch(0.48 0.09 50)",
      "--accent": "oklch(0.55 0.10 350)",
      "--ring": "oklch(0.75 0.13 165)",
      "--gradient-primary":
        "linear-gradient(135deg, oklch(0.65 0.13 165), oklch(0.62 0.13 50))",
      "--gradient-cozy":
        "linear-gradient(135deg, oklch(0.26 0.05 165), oklch(0.26 0.05 50) 50%, oklch(0.26 0.05 350))",
    },
  },
  {
    name: "Lavender",
    colors: ["oklch(0.82 0.09 295)", "oklch(0.86 0.09 200)", "oklch(0.86 0.10 350)"],
    vars: {
      "--primary": "oklch(0.72 0.14 295)",
      "--primary-glow": "oklch(0.82 0.10 295)",
      "--secondary": "oklch(0.86 0.09 200)",
      "--accent": "oklch(0.86 0.10 350)",
      "--ring": "oklch(0.72 0.14 295)",
      "--gradient-primary":
        "linear-gradient(135deg, oklch(0.78 0.13 295), oklch(0.82 0.11 200))",
      "--gradient-cozy":
        "linear-gradient(135deg, oklch(0.95 0.04 295), oklch(0.95 0.04 200) 50%, oklch(0.95 0.04 350))",
    },
    darkVars: {
      "--primary": "oklch(0.78 0.14 295)",
      "--primary-glow": "oklch(0.65 0.15 295)",
      "--secondary": "oklch(0.50 0.10 200)",
      "--accent": "oklch(0.55 0.10 350)",
      "--ring": "oklch(0.78 0.14 295)",
      "--gradient-primary":
        "linear-gradient(135deg, oklch(0.65 0.15 295), oklch(0.60 0.13 200))",
      "--gradient-cozy":
        "linear-gradient(135deg, oklch(0.26 0.05 295), oklch(0.26 0.05 200) 50%, oklch(0.26 0.05 350))",
    },
  },
  {
    name: "Sunset",
    colors: ["oklch(0.88 0.08 50)", "oklch(0.86 0.10 350)", "oklch(0.82 0.09 295)"],
    vars: {
      "--primary": "oklch(0.76 0.14 40)",
      "--primary-glow": "oklch(0.86 0.11 50)",
      "--secondary": "oklch(0.82 0.12 350)",
      "--accent": "oklch(0.82 0.09 295)",
      "--ring": "oklch(0.76 0.14 40)",
      "--gradient-primary":
        "linear-gradient(135deg, oklch(0.82 0.13 40), oklch(0.80 0.13 350))",
      "--gradient-cozy":
        "linear-gradient(135deg, oklch(0.96 0.04 50), oklch(0.95 0.04 350) 50%, oklch(0.95 0.04 295))",
    },
    darkVars: {
      "--primary": "oklch(0.75 0.15 40)",
      "--primary-glow": "oklch(0.62 0.15 40)",
      "--secondary": "oklch(0.52 0.12 350)",
      "--accent": "oklch(0.48 0.09 295)",
      "--ring": "oklch(0.75 0.15 40)",
      "--gradient-primary":
        "linear-gradient(135deg, oklch(0.65 0.15 40), oklch(0.60 0.14 350))",
      "--gradient-cozy":
        "linear-gradient(135deg, oklch(0.26 0.05 50), oklch(0.26 0.05 350) 50%, oklch(0.26 0.05 295))",
    },
  },
];

const THEME_KEY = "yumemo:theme";
const DARK_KEY = "yumemo:dark";

export function applyTheme(themeIdx: number, dark: boolean) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const t = themes[themeIdx] ?? themes[0];
  root.classList.toggle("dark", dark);
  const vars = dark ? t.darkVars : t.vars;
  for (const [k, v] of Object.entries(vars)) {
    root.style.setProperty(k, v);
  }
  try {
    localStorage.setItem(THEME_KEY, String(themeIdx));
    localStorage.setItem(DARK_KEY, dark ? "1" : "0");
  } catch {}
}

export function loadThemePrefs(): { themeIdx: number; dark: boolean } {
  if (typeof window === "undefined") return { themeIdx: 0, dark: false };
  try {
    const idx = Number(localStorage.getItem(THEME_KEY) ?? "0");
    const dark = localStorage.getItem(DARK_KEY) === "1";
    return { themeIdx: Number.isFinite(idx) ? idx : 0, dark };
  } catch {
    return { themeIdx: 0, dark: false };
  }
}