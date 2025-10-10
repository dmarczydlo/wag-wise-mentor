import { registerAs } from "@nestjs/config";

export default registerAs("supabase", () => ({
  url: process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  anonKey: process.env.VITE_SUPABASE_PUBLISHABLE_KEY,
}));

