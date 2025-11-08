import { z } from "zod";

/**
 * Environment variables validation schema
 * This ensures all required environment variables are present and valid
 */
const envSchema = z.object({
  // Public variables (accessible in browser)
  NEXT_PUBLIC_APP_URL: z.string().url().optional().or(z.literal("")),

  // Server-only variables
  OPENROUTER_API_KEY: z.string().min(1, "OpenRouter API key is required").optional(),
  OPENROUTER_MODEL: z.string().optional(),

  // Optional: Rate limiting with Upstash
  KV_REST_API_URL: z.string().url().optional().or(z.literal("")),
  KV_REST_API_TOKEN: z.string().optional().or(z.literal("")),

  // Node environment
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

/**
 * Validated environment variables
 * Use this instead of process.env to ensure type safety
 */
export const env = envSchema.parse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
  OPENROUTER_MODEL: process.env.OPENROUTER_MODEL,
  KV_REST_API_URL: process.env.KV_REST_API_URL,
  KV_REST_API_TOKEN: process.env.KV_REST_API_TOKEN,
  NODE_ENV: process.env.NODE_ENV,
});

/**
 * Type-safe environment variables
 */
export type Env = z.infer<typeof envSchema>;
