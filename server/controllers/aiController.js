//Controller for enchancing a resume's professional summary using AI

import Resume from "../models/Resume.js";
import ai from "../configs/ai.js";

const STOP_WORDS = new Set([
  "the", "and", "for", "with", "that", "this", "from", "have", "has", "had", "you", "your",
  "our", "will", "are", "was", "were", "their", "them", "they", "who", "what", "when", "where",
  "why", "how", "can", "could", "should", "would", "may", "might", "must", "into", "onto", "upon",
  "about", "over", "under", "after", "before", "than", "then", "also", "not", "all", "any", "per",
  "job", "role", "work", "team", "years", "year", "using", "use", "used", "required", "preferred",
]);

const tokenize = (text = "") =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word));

const getResumeText = (resumeData = {}) => {
  const skills = Array.isArray(resumeData.skills) ? resumeData.skills.join(" ") : "";
  const summary = resumeData.professional_summary || "";
  const experience = Array.isArray(resumeData.experience)
    ? resumeData.experience
        .map((item) => `${item?.position || ""} ${item?.company || ""} ${item?.description || ""}`)
        .join(" ")
    : "";
  const projectsRaw = resumeData.projects || resumeData.project;
  const projects = Array.isArray(projectsRaw)
    ? projectsRaw.map((item) => `${item?.name || ""} ${item?.type || ""} ${item?.description || ""}`).join(" ")
    : "";
  const education = Array.isArray(resumeData.education)
    ? resumeData.education.map((item) => `${item?.degree || ""} ${item?.field || ""} ${item?.institution || ""}`).join(" ")
    : "";

  return `${summary} ${skills} ${experience} ${projects} ${education}`;
};

const normalizeSentence = (text = "") => {
  const cleaned = String(text).replace(/\s+/g, " ").trim();
  if (!cleaned) return "";
  const firstUpper = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  return /[.!?]$/.test(firstUpper) ? firstUpper : `${firstUpper}.`;
};

const isRateLimitError = (error) =>
  Number(error?.status) === 429 || Number(error?.code) === 429 || /429|rate limit|quota/i.test(String(error?.message || ""));

const isModelNotFoundError = (error) =>
  Number(error?.status) === 404 || /404|model.*not found|not found/i.test(String(error?.message || ""));

const clipText = (text = "", maxChars = 2500) => String(text || "").slice(0, maxChars);

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getRetryAfterMs = (error) => {
  const rawHeader =
    error?.headers?.["retry-after"] ||
    error?.response?.headers?.["retry-after"] ||
    error?.cause?.headers?.["retry-after"];

  if (!rawHeader) return null;

  const seconds = Number(rawHeader);
  if (!Number.isNaN(seconds) && seconds > 0) {
    return Math.min(seconds * 1000, 15000);
  }

  const dateMs = Date.parse(rawHeader);
  if (!Number.isNaN(dateMs)) {
    const delta = dateMs - Date.now();
    if (delta > 0) {
      return Math.min(delta, 15000);
    }
  }

  return null;
};

const getModelCandidates = (primaryModel) => {
  const candidates = [primaryModel].filter(Boolean);

  return [...new Set(candidates)];
};

const createChatCompletionWithRetry = async (payload) => {
  const maxAttempts = 2;
  const models = getModelCandidates(payload?.model || process.env.OPENAI_MODEL);
  let lastError;
  let lastRateLimitError;

  for (const model of models) {
    const modelPayload = { ...payload, model };

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      try {
        return await ai.chat.completions.create(modelPayload);
      } catch (error) {
        lastError = error;

        if (isModelNotFoundError(error)) {
          // Candidate model not available on this provider/account, try next model.
          break;
        }

        if (!isRateLimitError(error)) {
          throw error;
        }

        lastRateLimitError = error;

        if (attempt === maxAttempts) {
          // Move to next candidate model.
          break;
        }

        // Respect provider Retry-After when available, otherwise use exponential backoff.
        const retryAfterMs = getRetryAfterMs(error);
        const backoffMs = retryAfterMs ?? 800 * Math.pow(2, attempt - 1);
        await wait(backoffMs);
      }
    }
  }

  throw lastRateLimitError || lastError;
};

const getMessageText = (completion) => {
  const content = completion?.choices?.[0]?.message?.content;

  if (Array.isArray(content)) {
    return content
      .map((part) => (typeof part === "string" ? part : part?.text || ""))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
  }

  return String(content || "").replace(/\s+/g, " ").trim();
};

const countWords = (text = "") => String(text).trim().split(/\s+/).filter(Boolean).length;

const generateSummaryWithAiOnly = async (draftText = "") => {
  const completion = await createChatCompletionWithRetry({
    model: process.env.OPENAI_MODEL,
    messages: [
      {
        role: "system",
        content:
          "You are a resume writing expert. Output exactly one paragraph only, 120-160 words, complete sentences, professional tone, and no bullets or headings.",
      },
      {
        role: "user",
        content: `Rewrite this draft into one polished professional summary paragraph (120-160 words):\n${draftText}`,
      },
    ],
    temperature: 0.55,
    max_tokens: 420,
  });

  return getMessageText(completion);
};

const expandSummaryIfTooShort = async (draftText = "", currentSummary = "") => {
  const completion = await createChatCompletionWithRetry({
    model: process.env.OPENAI_MODEL,
    messages: [
      {
        role: "system",
        content:
          "You are a resume writing expert. Return exactly one paragraph, 120-160 words, complete sentences, professional tone, no bullets or headings.",
      },
      {
        role: "user",
        content: `The summary below is too short. Expand and polish it into one complete professional summary paragraph (120-160 words).\nDraft: ${draftText}\nShort summary: ${currentSummary}`,
      },
    ],
    temperature: 0.55,
    max_tokens: 460,
  });

  return getMessageText(completion);
};

//POST: /api/ai/enhance-pro-sum
export const enhanceProfessionalSummary = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const draft = clipText(userContent, 1800);
    let enhancedContent = await generateSummaryWithAiOnly(draft);

    if (countWords(enhancedContent) < 100) {
      const expanded = await expandSummaryIfTooShort(draft, enhancedContent);
      if (countWords(expanded) > countWords(enhancedContent)) {
        enhancedContent = expanded;
      }
    }

    if (!enhancedContent.trim()) {
      return res.status(502).json({
        message: "AI returned an empty summary. Please click Enhance again.",
      });
    }

    return res.status(200).json({ enhancedContent });
  } catch (error) {
    if (isRateLimitError(error)) {
      return res.status(429).json({
        message: "AI rate limit reached. Please try again in a moment.",
      });
    }
    return res.status(400).json({ message: error?.message || "Failed to enhance professional summary" });
  }
};

// controller for enhancing a resume's job description
// POST: /api/ai/enhance-job-desc
export const enhanceJobDescription = async (req, res) => {
  try {
    const { userContent, position, company } = req.body;

    if (!userContent) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const response = await createChatCompletionWithRetry({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You improve resume experience bullets. Return only 1-2 concise, impactful sentences with action verbs and measurable outcomes when possible.",
        },
        {
          role: "user",
          content: `Position: ${clipText(position || "N/A", 120)}\nCompany: ${clipText(company || "N/A", 120)}\nDescription: ${clipText(userContent, 1200)}`,
        },
      ],
      temperature: 0.4,
      max_tokens: 120,
    });

    const enhancedContent = response.choices[0].message.content;
    return res.status(200).json({ enhancedContent });
  } catch (error) {
    if (isRateLimitError(error)) {
      return res.status(429).json({
        message: "AI rate limit reached. Please try again in a moment.",
      });
    }
    return res.status(400).json({ message: error?.message || "Failed to enhance job description" });
  }
};

// controller for updating a resume to the database
// POST: /api/ai/upload-resume
export const uploadResume = async (req, res) => {
  try {
    const { resumeText, title } = req.body;
    const userId = req.userId;

    if (!resumeText) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const systemPrompt =
      "You are an expert AI Agent to extract data from resume.";

    const userPrompt = `Extract data from this resume: ${resumeText}
    Provide the extracted data in the following JSON format:

    {
      professional_summary: {type: String, default: ""},
      skills: [{type: String}],
      personal_info: {
          image: {type: String, default: ""},
          full_name: {type: String, default: ""},
          profession: {type: String, default: ""},
          email: {type: String, default: ""},
          phone: {type: String, default: ""},
          location: {type: String, default: ""},
          linkedin: {type: String, default: ""},
          github: {type: String, default: ""},
          website: {type: String, default: ""}
      },  
      experience: [
        {
          company: {type: String},
          position: {type: String},
          start_date: {type: String},
          end_date: {type: String},
          description: {type: String},
          is_current: {type: Boolean},
        }
      ],

      project: [
        {
          name: {type: String},
          type: {type: String},
          description: {type: String},
        }
      ],
      education: [
        {
          institution: {type: String},
          degree: {type: String},
          field: {type: String},
          graduation_date: {type: String},
          gpa: {type: String},
        }
      ]
    }
    `;

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      response_format: { type: "json_object" },
    });

    const extractedData = response.choices[0].message.content;
    const parsedData = JSON.parse(extractedData);
    const newResume = await Resume.create({ userId, title, ...parsedData });

    res.json({
      message: "Resume uploaded successfully",
      resumeId: newResume._id,
      resume: newResume,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// controller for matching resume against a job description
// POST: /api/ai/job-match
export const analyzeJobMatch = async (req, res) => {
  try {
    const { resumeData, jobDescription } = req.body;

    if (!resumeData || !jobDescription) {
      return res.status(400).json({ message: "resumeData and jobDescription are required" });
    }

    const resumeText = getResumeText(resumeData);
    const resumeSet = new Set(tokenize(resumeText));
    const jdTokens = tokenize(jobDescription);

    const frequency = {};
    for (const token of jdTokens) {
      frequency[token] = (frequency[token] || 0) + 1;
    }

    const topKeywords = Object.keys(frequency)
      .sort((a, b) => frequency[b] - frequency[a])
      .slice(0, 30);

    const matchedKeywords = topKeywords.filter((keyword) => resumeSet.has(keyword));
    const missingKeywords = topKeywords.filter((keyword) => !resumeSet.has(keyword)).slice(0, 12);

    const rawScore = topKeywords.length
      ? Math.round((matchedKeywords.length / topKeywords.length) * 100)
      : 0;

    const score = Math.max(0, Math.min(100, rawScore));

    return res.status(200).json({
      score,
      matchedKeywords: matchedKeywords.slice(0, 12),
      missingKeywords,
      recommendations: [
        "Add 3-5 missing keywords naturally in your experience bullets.",
        "Use measurable impact (%, time saved, revenue, users) in at least 2 bullets.",
        "Mirror the job title terminology in your summary and skills section.",
      ],
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
