import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== 'production';

// In dev: include 'unsafe-eval' for React/Turbopack devtools support
// In prod: strict CSP without eval
const scriptSrc = isDev
  ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
  : "script-src 'self' 'unsafe-inline'";

const cspValue = [
  "default-src 'self'",
  scriptSrc,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: *.googleusercontent.com *.githubusercontent.com *.supabase.co",
  "connect-src 'self' *.supabase.co wss://*.supabase.co https://*.supabase.co https://generativelanguage.googleapis.com",
].join('; ');

const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control',   value: 'on' },
  { key: 'Strict-Transport-Security',value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-XSS-Protection',         value: '1; mode=block' },
  { key: 'X-Frame-Options',           value: 'SAMEORIGIN' },
  { key: 'Permissions-Policy',        value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
  { key: 'X-Content-Type-Options',    value: 'nosniff' },
  { key: 'Referrer-Policy',           value: 'origin-when-cross-origin' },
  { key: 'Content-Security-Policy',   value: cspValue },
];

const nextConfig: NextConfig = {
  turbopack: {},
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
