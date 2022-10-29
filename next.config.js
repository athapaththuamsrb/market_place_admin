/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		domains: ["exclusives.infura-ipfs.io"],
		formats: ["image/webp"],
	},
	webpack: (config, { isServer }) => {
		// Fixes npm packages that depend on `fs` module
		if (!isServer) {
		  config.node = {
			fs: 'empty'
		  }
		}
	
		return config
	  }
};

module.exports = nextConfig;
