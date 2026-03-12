import "dotenv/config";

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is missing/not set!`);
  }

  return value;
}

export function getPort(): number {
  return Number(process.env.PORT ?? 3000);
}

export function getGeminiApiKey(): string {
  return getRequiredEnv("GEMINI_API_KEY");
}

export function getFoursquareApiKey(): string {
  return getRequiredEnv("FOURSQUARE_API_KEY");
}

export function getFoursquareBaseUrl(): string {
  return getRequiredEnv("BASE_URL");
}
