/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  webpack(config, { isServer }) {
    // https://github.com/wojtekmaj/react-pdf/issues/799
    // https://github.com/mozilla/pdf.js/issues/13373
    if (isServer) {
      config.resolve.alias.canvas = false
    }

    return config
  },
}

module.exports = nextConfig
