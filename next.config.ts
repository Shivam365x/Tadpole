import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Deployed on Vercel as a native Next.js app: all pages are prerendered as
  // static content automatically, and image optimization stays enabled.
  // (No `output: 'export'` needed — that mode is only for generic static hosts.)
  reactStrictMode: true,
};

export default nextConfig;
