import "dotenv/config";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

const sample = "web dev with 6 years of experience building complex web apps using react js, node js, mongo db ...";

const run = async () => {
  const response = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL,
    messages: [
      {
        role: "system",
        content:
          "You improve resume professional summaries. Return exactly one paragraph with 65-110 words, professional tone, no bullet points, no headings.",
      },
      {
        role: "user",
        content: `Rewrite this draft into a complete professional summary paragraph (65-110 words):\n${sample}`,
      },
    ],
    temperature: 0.5,
    max_tokens: 260,
  });

  const output = response?.choices?.[0]?.message?.content || "";
  const words = String(output).trim().split(/\s+/).filter(Boolean).length;

  console.log("Sample input:", sample);
  console.log("Output words:", words);
  console.log("Output:\n", output);
};

run().catch((e) => {
  console.error("FAILED");
  console.error("status:", e?.status);
  console.error("message:", e?.message);
});
