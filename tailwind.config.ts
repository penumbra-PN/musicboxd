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
        'spotify-black': "#2B2B2B",
        'spotify-white': "#FFFFFF", 
        'textbox-gray': "#ADADAD"
      },
    },
  },
  plugins: [],
};
export default config;
