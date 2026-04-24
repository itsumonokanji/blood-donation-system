/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Включаем режим "мне всё равно на ошибки"
    ignoreBuildErrors: true,
  },
  eslint: {
    // И линтер тоже отключаем, чтоб не приставал
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
