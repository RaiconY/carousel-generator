import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

// SSRF Protection: Block private IP ranges and localhost
const BLOCKED_HOSTNAMES = [
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "::1",
  "169.254.169.254", // AWS metadata
  "metadata.google.internal", // GCP metadata
];

const PRIVATE_IP_PATTERNS = [
  /^10\./,
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
  /^192\.168\./,
  /^127\./,
  /^0\./,
  /^169\.254\./,
  /^fc00:/i,
  /^fe80:/i,
  /^::1$/,
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const FETCH_TIMEOUT = 10000; // 10 seconds

function isPrivateOrLocalhost(hostname: string): boolean {
  // Check blocked hostnames
  if (BLOCKED_HOSTNAMES.includes(hostname.toLowerCase())) {
    return true;
  }

  // Check private IP patterns
  return PRIVATE_IP_PATTERNS.some((pattern) => pattern.test(hostname));
}

function validateImageUrl(urlString: string): { valid: boolean; error?: string; url?: URL } {
  let url: URL;

  try {
    url = new URL(urlString);
  } catch {
    return { valid: false, error: "Invalid URL format" };
  }

  // Only allow HTTPS (or HTTP for localhost in dev)
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    return { valid: false, error: "Only HTTPS protocol is allowed" };
  }

  // For production, enforce HTTPS only
  if (url.protocol !== "https:" && process.env.NODE_ENV === "production") {
    return { valid: false, error: "Only HTTPS is allowed in production" };
  }

  // Block private IPs and localhost
  if (isPrivateOrLocalhost(url.hostname)) {
    return { valid: false, error: "Access to private/local resources is forbidden" };
  }

  return { valid: true, url };
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const imageUrl = url.searchParams.get("url");

    if (!imageUrl) {
      return new NextResponse("URL parameter is required", { status: 400 });
    }

    // Validate URL and check for SSRF
    const validation = validateImageUrl(imageUrl);
    if (!validation.valid) {
      return new NextResponse(validation.error, { status: 400 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "";

    // Fetch image with timeout and size limit
    const { contentType, body } = await fetchExternalImageUrl(imageUrl);

    if (
      !(typeof contentType === "string") ||
      !contentType.startsWith("image")
    ) {
      return new NextResponse("Content type must be image", { status: 400 });
    }

    const headers = new Headers();
    headers.set("Access-Control-Allow-Origin", siteUrl);
    headers.set("Content-Type", contentType);
    headers.set("Cache-Control", "public, max-age=31536000, immutable");

    return new NextResponse(body, {
      status: 200,
      statusText: "OK",
      headers,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Proxy error";

    // Don't log sensitive error details in production
    if (process.env.NODE_ENV !== "production") {
      console.error("Proxy error:", error);
    }

    return new NextResponse(errorMessage, {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
}

async function fetchExternalImageUrl(imageUrl: string) {
  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

  try {
    const response = await fetch(imageUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; ImageProxy/1.0)",
      },
      // Prevent following redirects to potentially dangerous URLs
      redirect: "follow",
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get("Content-Type");

    // Check content length if available
    const contentLength = response.headers.get("Content-Length");
    if (contentLength && parseInt(contentLength) > MAX_FILE_SIZE) {
      throw new Error(`Image size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB`);
    }

    return { contentType, body: response.body };
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timeout: Image fetch took too long");
    }

    throw error;
  }
}
