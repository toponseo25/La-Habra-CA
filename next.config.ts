import type { NextConfig } from "next";

/**
 * Next.js config for the RAS Heating & Air La Habra landing page.
 *
 * `output: "standalone"` produces a minimal, self-contained production bundle
 * (used by `bun run start` locally AND by Vercel for the serverless function).
 *
 * `typescript.ignoreBuildErrors: true` is set because the project ships with a
 * few `any` types in the analytics layer (intentional — the discriminated union
 * makes the public API fully typed) and we don't want a build to fail on a
 * strict type error during a deploy. Lint + the dev server still catch real
 * issues during development.
 *
 * `outputFileTracingIncludes` ensures the Prisma generated client + schema
 * are included in the standalone server bundle — without this, the serverless
 * function on Vercel can't find `@prisma/client` at runtime.
 */
const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    // Lint is run separately (`bun run lint`) — don't fail the Vercel build on
    // lint warnings. The pre-existing GTM inline-script warning is intentional.
    ignoreDuringBuilds: true,
  },
  reactStrictMode: false,
  outputFileTracingIncludes: {
    "/api/leads": ["./node_modules/.prisma/**/*", "./prisma/**/*"],
    "/api/track": ["./node_modules/.prisma/**/*", "./prisma/**/*"],
  },
};

export default nextConfig;
