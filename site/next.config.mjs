/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  // Skjul Next.js' dev-indikator (det lille logo i hjørnet under udvikling).
  devIndicators: false,
};

export default nextConfig;
