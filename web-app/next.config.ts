/** @type {import('next').NextConfig} */
const nextConfig = {
	async rewrites() {
		return [
			{
				source: "/write",
				destination: "/html/write-post.html",
			},
		];
	},
};

module.exports = nextConfig;
