export function isOktaConfigured() {
  return Boolean(
    process.env.OKTA_ISSUER &&
      process.env.OKTA_CLIENT_ID &&
      process.env.OKTA_CLIENT_SECRET &&
      process.env.NEXTAUTH_SECRET &&
      process.env.NEXTAUTH_URL
  );
}

export function isFirestoreConfigured() {
  return Boolean(
    process.env.GOOGLE_CLOUD_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY
  );
}

export function isGeminiConfigured() {
  return Boolean(process.env.GEMINI_API_KEY);
}

export function missingEnv(keys: string[]) {
  return keys.filter((k) => !process.env[k]);
}
