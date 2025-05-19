import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ChipFlow",
    short_name: "ChipFlow",
    description: "A Poker chip management platform",
    start_url: "/",
    display: "standalone",
    background_color: "#09122C",
    theme_color: "#09122C",
    icons: [
      {
        src: "192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
