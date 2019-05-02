const withCSS = require('@zeit/next-css');

module.exports = withCSS({
  cssModules: true,
  distDir: '../out',
  webpack: config => {
    config.module.rules.push({
      test: /\.(jpe?g|png)$/,
      use: [
        {
          loader: 'url-loader',
          options: {
            limit: 8192,
            fallback: 'file-loader',
            publicPath: '/_next/',
            outputPath: 'static/',
            name: '[name]-[hash].[ext]',
          },
        },
      ],
    });

    return config;
  },
});
