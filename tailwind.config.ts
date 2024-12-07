import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ''
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'spotify-green': "#1CD85F",
        'spotify-black': "#121212",
        'spotify-white': "#FFFFFF"
      },
    },
  },
  plugins: [],
};
export default config;
