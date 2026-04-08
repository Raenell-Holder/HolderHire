import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config({ path: "./.env" });

console.log("Server file started");
console.log("API key exists:", !!process.env.OPENAI_API_KEY);
console.log("API key prefix:", process.env.OPENAI_API_KEY?.slice(0, 7));

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get("/", (req, res) => {
  res.send("HolderHire backend is running");
});

app.get("/env-check", (req, res) => {
  res.json({
    cwd: process.cwd(),
    hasKey: !!process.env.OPENAI_API_KEY,
    prefix: process.env.OPENAI_API_KEY?.slice(0, 7) || null,
  });
});

app.post("/search-jobs", async (req, res) => {
  try {
    console.log("POST /search-jobs hit");
    console.log("Request body:", req.body);

    const {
      jobType = "",
      location = "",
      distance = "",
      englishLevel = "",
      preferredLanguage = "English",
      workType = "",
      experience = "",
      transportation = "",
      schedule = "",
      additionalNeeds = ""
    } = req.body || {};

    const userPrompt = `
Return 5 job recommendations in JSON format ONLY.

Each job must follow this exact structure:

[
  {
    "title": "Job title",
    "company": "Company name or company type",
    "description": "Short simple explanation of the job",
    "why_fit": "Why this job fits the user",
    "english_level": "Beginner / Intermediate / Advanced",
    "entry_level": "Yes or No",
    "location": "City or area",
    "commute_fit": "Short explanation of whether the commute or work arrangement fits the user",
    "match_score": "0-100%",
    "accessibility_tags": ["Tag 1", "Tag 2", "Tag 3"],
    "apply_link": "REAL Indeed search link"
  }
]

User preferences:
Job type: ${jobType}
Location: ${location}
Distance: ${distance}
English level: ${englishLevel}
Preferred language for results: ${preferredLanguage}
Work type: ${workType}
Experience: ${experience}
Transportation: ${transportation}
Schedule: ${schedule}
Additional needs: ${additionalNeeds}

IMPORTANT RULES:
- Return ONLY valid JSON
- No markdown
- No explanation outside the JSON
- Use simple, beginner-friendly language
- The description and why_fit should be easy to understand
- accessibility_tags should be short and helpful, such as:
  "Beginner English Friendly", "Transit Accessible", "No Degree Required", "Day Shift", "Entry Level"
- apply_link must be a realistic Indeed search URL, for example:
  https://www.indeed.com/jobs?q=warehouse&l=Albany%2C+NY
- Write the values in ${preferredLanguage} when reasonable and possible
`;

    const systemPrompt =
      "You are HolderHire's job assistant. Help users find practical and accessible jobs. Prioritize clarity, simplicity, and usefulness. Focus on realistic entry-level and accessible opportunities for newcomers and underserved job seekers. Do not make assumptions about immigration status.";

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: userPrompt
        }
      ]
    });

    const rawText = completion.choices[0].message.content;
    console.log("RAW AI RESPONSE:", rawText);

    let jobs;

    try {
      jobs = JSON.parse(rawText);
    } catch (parseError) {
      console.log("JSON parsing failed, returning raw text");
      return res.json({
        result: rawText || "No results returned."
      });
    }

    res.json({ jobs });
  } catch (error) {
    console.dir(error, { depth: null });

    res.status(500).json({
      error: "Something went wrong",
      details: error?.message || "No message available",
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});