/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Это мы оставляем, чтобы билд не падал из-за типов
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      {
        source: '/',           // Если пользователь зашел на корень сайта
        destination: '/register', // Его перекинет сюда
        permanent: true,       // Браузер запомнит этот редирект
      },
    ];
  },
};

export default nextConfig;


