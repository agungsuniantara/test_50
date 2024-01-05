const rewrites = async () => [
  {
    source: "/docs",
    destination: "https://mindseat.mintlify.app/introduction",
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites,
  assetPrefix: "https://mindseat.mintlify.app"
}

module.exports = nextConfig
