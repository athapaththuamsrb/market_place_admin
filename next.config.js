/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		domains: ["exclusives.infura-ipfs.io"],
		formats: ["image/webp"],
	},
};

module.exports = nextConfig;
