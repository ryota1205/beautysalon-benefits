import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ngrok等の外部URLからのアクセスを許可
  allowedDevOrigins: ["*.ngrok-free.app", "*.ngrok.io"],
};

export default nextConfig;
