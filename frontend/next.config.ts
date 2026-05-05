import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(process.cwd()),
  },
  transpilePackages: ['html2pdf.js'],
  webpack: (config) => {
    config.externals = config.externals || [];
    config.externals.push({
      'html2pdf.js': 'html2pdf',
    });
    return config;
  },
};

export default nextConfig;
