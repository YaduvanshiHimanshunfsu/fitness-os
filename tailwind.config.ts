import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'var(--background)',
  			foreground: 'var(--foreground)',
        "success-green": "#22C55E",
        "secondary-container": "#454747",
        "on-secondary-fixed-variant": "#454747",
        "inverse-surface": "#e5e2e1",
        "surface-bright": "#3a3939",
        "primary-container": "#ff6b35",
        "on-background": "#e5e2e1",
        "glass-border": "rgba(255, 255, 255, 0.1)",
        "error-container": "#93000a",
        "tertiary": "#c8c6c5",
        "outline": "#a98a80",
        "tertiary-fixed-dim": "#c8c6c5",
        "on-tertiary-fixed-variant": "#474746",
        "on-tertiary": "#313030",
        "primary": "#ffb59d",
        "on-tertiary-fixed": "#1c1b1b",
        "error": "#ffb4ab",
        "tertiary-fixed": "#e5e2e1",
        "on-primary-container": "#5f1900",
        "primary-fixed-dim": "#ffb59d",
        "muted-text": "#A1A1AA",
        "surface": "#131313",
        "on-error-container": "#ffdad6",
        "on-secondary-fixed": "#1a1c1c",
        "on-secondary-container": "#b4b5b5",
        "on-surface-variant": "#e1bfb5",
        "surface-container-lowest": "#0e0e0e",
        "accent-glow": "rgba(255, 107, 53, 0.35)",
        "inverse-primary": "#ab3500",
        "inverse-on-surface": "#313030",
        "surface-container-high": "#2a2a2a",
        "on-error": "#690005",
        "on-primary-fixed": "#390c00",
        "on-primary-fixed-variant": "#832600",
        "surface-dim": "#131313",
        "outline-variant": "#594139",
        "surface-container-low": "#1c1b1b",
        "secondary-fixed": "#e2e2e2",
        "surface-container-highest": "#353534",
        "secondary-fixed-dim": "#c6c6c7",
        "secondary": "#c6c6c7",
        "surface-tint": "#ffb59d",
        "surface-container": "#201f1f",
        "on-primary": "#5d1900",
        "tertiary-container": "#9b9999",
        "on-surface": "#e5e2e1",
        "primary-fixed": "#ffdbd0",
        "surface-variant": "#353534",
        "on-tertiary-container": "#323131",
        "glass-surface": "rgba(255, 255, 255, 0.05)",
        "on-secondary": "#2f3131"
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
      spacing: {
        "stack-lg": "32px",
        "stack-md": "16px",
        "margin-page": "40px",
        "section-gap": "64px",
        "container-max": "1440px",
        "gutter": "24px",
        "stack-sm": "8px"
      },
      fontFamily: {
        "display-xl": ["Geist"],
        "body-base": ["Geist"],
        "label-sm": ["Geist"],
        "headline-lg": ["Geist"],
        "metric-md": ["Geist"],
        "headline-lg-mobile": ["Geist"]
      },
      fontSize: {
        "display-xl": ["72px", {"lineHeight": "1.1", "letterSpacing": "-0.04em", "fontWeight": "800"}],
        "body-base": ["16px", {"lineHeight": "1.6", "fontWeight": "400"}],
        "label-sm": ["12px", {"lineHeight": "1", "letterSpacing": "0.05em", "fontWeight": "600"}],
        "headline-lg": ["40px", {"lineHeight": "1.2", "letterSpacing": "-0.02em", "fontWeight": "700"}],
        "metric-md": ["24px", {"lineHeight": "1.4", "letterSpacing": "0.02em", "fontWeight": "600"}],
        "headline-lg-mobile": ["32px", {"lineHeight": "1.2", "fontWeight": "700"}]
      }
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
