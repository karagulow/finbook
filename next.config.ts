const withPWA = require('next-pwa')({
	dest: 'public',
	register: true,
	skipWaiting: true,
	disable: process.env.NODE_ENV === 'development',
});

const nextConfig = {
	reactStrictMode: true,
	async headers() {
		return [
			{
				source: '/:path*',
				headers: [
					{
						key: 'Accept-CH',
						value:
							'Sec-CH-UA-Full-Version-List, Sec-CH-UA-Mobile, Sec-CH-UA-Model, Sec-CH-UA-Platform, Sec-CH-UA-Platform-Version, Sec-CH-UA-Arch, Sec-CH-UA-Bitness, Sec-CH-UA-Form-Factors',
					},
				],
			},
		];
	},
};

module.exports = withPWA(nextConfig);
