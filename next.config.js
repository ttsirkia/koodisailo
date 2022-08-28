const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const conf = { reactStrictMode: true, basePath: "/koodisailo" };

module.exports = withBundleAnalyzer(conf);

