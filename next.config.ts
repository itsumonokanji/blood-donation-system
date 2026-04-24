/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Пропускаем ошибки типов при сборке
    ignoreBuildErrors: true,
  },
  eslint: {
    // Пропускаем проверку линтера
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
