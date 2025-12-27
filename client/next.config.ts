import type { NextConfig } from "next";

const nextConfig: NextConfig = {

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
        port: "5000",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "teachers-server.onrender.com",
        pathname: "**",
      },
    ],
  },

  turbopack: {},


  env: {
    customKey: "novaraTo",
    local: process.env.LOCAL_API_URL,
    img: process.env.LOCAL_IMG_URL,
    teacherId: process.env.TEACHER_ID,
    TOKEN_SECRET: process.env.TOKEN_SECRET,
    limitStudent: process.env.LIMIT_STUDENT,
    assist: process.env.ASSIST,
  },

  webpack: (config) => {
    return config;
  },
};

export default nextConfig;