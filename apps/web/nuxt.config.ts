import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  ssr: true,

  modules: [
    "@nuxt/content",
    "@nuxt/icon",
    "@nuxt/eslint",
    "@nuxtjs/color-mode",
    "shadcn-nuxt",
  ],
  app: {
    head: {
      link: [
        {
          rel: "icon",
          type: "image/x-icon",
          href: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🧑‍🍳</text></svg>",
        },
      ],
    },
  },

  css: ["~/assets/css/globals.css", "~/assets/css/tailwind.css"],
  colorMode: { classSuffix: "" },

  content: {
    experimental: { nativeSqlite: true },
    build: {
      markdown: {
        highlight: {
          // See the available themes on https://github.com/shikijs/shiki/blob/main/docs/themes.md#all-theme
          theme: {
            dark: "github-dark",
            default: "github-light",
          },
        },
      },
    },
  },
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: "2025-02-19",

  runtimeConfig: {
    public: {
      apiUrl: process.env.VITE_API_URL,
    },
  },

  vite: { plugins: [tailwindcss()] },

  shadcn: {
    prefix: "",
    componentDir: "@/components/ui",
  },
});
