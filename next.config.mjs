/** @type {import('next').NextConfig} */

// Derived from the env var rather than hard-coded. The previous literal still
// pointed at cnwbqqvfgihkmomzvwdg.supabase.co — the project that was lost to a
// >90 day pause — so every next/image call with a storage URL would have thrown
// "hostname is not configured under images". It went unnoticed only because no
// profile picture had been uploaded yet.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const nextConfig = {
  images: {
    remotePatterns: supabaseUrl
      ? [
          {
            protocol: "https",
            hostname: new URL(supabaseUrl).hostname,
            port: "",
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
  },
};

export default nextConfig;
