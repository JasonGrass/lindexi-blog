import { defineConfig, squooshImageService } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import sitemap from "@astrojs/sitemap";
import { SITE } from "./src/config";
import mdx from "@astrojs/mdx";
import rehypeExternalLinks from "rehype-external-links";
import expressiveCode from "astro-expressive-code";
import { asideAutoImport, astroAsides } from "./src/utils/astro-asides";
import AutoImport from "astro-auto-import";

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  integrations: [
    AutoImport({
      imports: [asideAutoImport],
    }),
    astroAsides(),
    expressiveCode({
      // You can set configuration options here
      themes: ["dracula", "github-light"],
      useDarkModeMediaQuery: false,
    }),
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
    sitemap(),
    mdx(),
  ],
  markdown: {
    remarkPlugins: [
      remarkToc,
      [
        remarkCollapse,
        {
          test: "Table of contents",
        },
      ],
    ],
    rehypePlugins: [
      [
        rehypeExternalLinks,
        {
          target: "_blank",
          rel: ["noopener", "noreferrer"],
        },
      ],
    ],
  },
  // image: {
  //   service: squooshImageService(),
  // },
  vite: {
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
  scopedStyleStrategy: "where",
});
