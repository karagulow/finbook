import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	/* config options here */
};

const withPWA = require('next-pwa')({
	dest: 'public',
	disable: true,
});
module.exports = withPWA({});

export default nextConfig;
