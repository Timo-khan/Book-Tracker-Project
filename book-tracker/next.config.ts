// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
// 	images: {
// 		remotePatterns: [
// 			{ protocol: "https", hostname: "books.google.com" },
// 			{ protocol: "https", hostname: "books.googleusercontent.com" },
// 			{ protocol: "https", hostname: "covers.openlibrary.org" }, // for Open Library
// 		],
// 	},
// };

/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "http",
				hostname: "books.google.com",
				port: "",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "books.google.com",
				port: "",
				pathname: "/**",
			},
		],
	},
};

export default nextConfig;
