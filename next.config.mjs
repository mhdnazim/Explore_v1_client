const nextConfig = {
    images: {
      // domains: ['upload.wikimedia.org', 'localhost', 'explore-server.onrender.com'], // Add other domains as needed
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'upload.wikimedia.org',
          pathname: '**',
        },
        {
          protocol: 'http',
          hostname: 'localhost',
          pathname: '**',
        },
        {
          protocol: 'https',
          hostname: 'explore-server.onrender.com',
          pathname: '**',
        },
      ],
    },
  };
  
  export default nextConfig;
  