import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "s1.ticketm.net" },
      { protocol: "https", hostname: "images.universe.com" },
      { protocol: "https", hostname: "ra.co" },
      { protocol: "https", hostname: "**.bandsintown.com" },
      { protocol: "https", hostname: "www.musicfestivalwizard.com" },
    ],
  },
};

export default nextConfig;
