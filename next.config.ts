import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export const authOptions = {
  session: {
    strategy: "jwt",
  },
};

export default nextConfig;
