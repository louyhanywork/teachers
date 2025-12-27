import { withNextVideo } from "next-video/process";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ❗ مؤقتًا (مش أنصح بيه دايمًا)
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/image/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "storyset.com",
        pathname: "**",
      },
      {
        protocol: "http",
        hostname: "192.168.1.3",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "teachers-server.onrender.com",
        pathname: "**",
      },
    ],
  },

  // ❗ مهم جدًا لحل مشكلة Turbopack
  turbopack: {},

  // ✔️ اتشالت من experimental
  outputFileTracingIncludes: {
    "*": ["./node_modules/next-video/**/*"],
  },



  // ✔️ نجبره يستخدم webpack
  webpack: (config) => {
    return config;
  },
};

export default withNextVideo(nextConfig, { folder: "y" });
