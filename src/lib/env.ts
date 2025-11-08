import { z } from "zod";

/**
 * Environment variables validation schema
 * This ensures all required environment variables are present and valid
 */
const envSchema = z.object({
  // Public variables (accessible in browser)
  NEXT_PUBLIC_APP_URL: z.string().url().optional().or(z.literal("")),

  // Node environment
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

/**
 * Validated environment variables
 * Use this instead of process.env to ensure type safety
 */
export const env = envSchema.parse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NODE_ENV: process.env.NODE_ENV,
});

/**
 * Type-safe environment variables
 */
export type Env = z.infer<typeof envSchema>;
