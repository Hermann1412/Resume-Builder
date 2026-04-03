import "dotenv/config";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

const model = process.env.OPENAI_MODEL;

const mask = (value = "") => {
  if (!value) return "(empty)";
  if (value.length <= 8) return "********";
  return `${value.slice(0, 4)}...${value.slice(-4)}`;
};

console.log("AI diagnostics:");
console.log("- baseURL:", process.env.OPENAI_BASE_URL || "(empty)");
console.log("- model:", model || "(empty)");
console.log("- apiKey:", mask(process.env.OPENAI_API_KEY));

try {
  const res = await client.chat.completions.create({
    model,
    messages: [{ role: "user", content: "Say hello in 5 words." }],
    max_tokens: 40,
  });

  console.log("RESULT: OK");
  console.log("Output:", res?.choices?.[0]?.message?.content || "(no content)");
} catch (error) {
  console.log("RESULT: ERROR");
  console.log("status:", error?.status ?? "unknown");
  console.log("code:", error?.code ?? "unknown");
  console.log("type:", error?.type ?? "unknown");
  console.log("message:", error?.message ?? "(no message)");

  if (error?.response?.data) {
    console.log("response-data:", JSON.stringify(error.response.data, null, 2));
  }
}
