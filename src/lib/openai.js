// Lazy initialisation d'OpenAI
let client;
export async function getOpenAI() {
  if (!client) {
    const { default: OpenAI } = await import("openai"); // import dynamique
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY missing");
    }
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return client;
}