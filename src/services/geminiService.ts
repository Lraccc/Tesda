import { GoogleGenAI, Type } from "@google/genai";
import { 
  ResumeData, 
  RoastResult, 
  InterviewMessage, 
  InterviewType, 
  Difficulty, 
  InterviewFeedback, 
  InterviewScorecard 
} from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `You are ResumeAI, an expert career coach and resume writer specialized in helping Filipino IT students and fresh graduates.
Your goal is to build ATS-optimized resumes. 
- Use strong action verbs (developed, engineered, automated, optimized).
- Focus on impact and results.
- Ensure the tone is professional yet encouraging.
- Tailor language to Filipino recruitment context (e.g., OJT is Internship).`;

export async function generateResumeAI(userInput: Partial<ResumeData>, targetRole?: string) {
  const model = "gemini-3-flash-preview";
  
  const prompt = `Generate a professional, ATS-friendly resume based on the following data:
  ${JSON.stringify(userInput)}
  
  Target Role: ${targetRole || "IT Generalist"}
  
  Please:
  1. Rephrase all descriptions using strong action verbs and professional language.
  2. Create a 2-3 sentence targeted Professional Summary.
  3. Ensure all tech skills are categorized logically.
  
  Return the completed resume data in the same JSON structure as the input.`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          personalInfo: { type: Type.OBJECT },
          summary: { type: Type.STRING },
          education: { type: Type.ARRAY, items: { type: Type.OBJECT } },
          techSkills: { type: Type.OBJECT },
          projects: { type: Type.ARRAY, items: { type: Type.OBJECT } },
          experience: { type: Type.ARRAY, items: { type: Type.OBJECT } },
          certifications: { type: Type.ARRAY, items: { type: Type.STRING } },
        }
      }
    }
  });

  if (!response.text) throw new Error("Failed to generate resume");
  return JSON.parse(response.text) as ResumeData;
}

export async function roastResume(resume: ResumeData) {
  const model = "gemini-3-flash-preview";
  
  const prompt = `Roast this resume with brutal honesty but constructive feedback. 
  Pretend you are a grumpy HR manager at a top tech company in the Philippines.
  
  Resume: ${JSON.stringify(resume)}
  
  Provide:
  1. An overall score (0-100).
  2. A paragraph of direct, "painfully honest" critique.
  3. A list of specific issues found in each section and how to fix them.`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        required: ["overallScore", "critique", "fixes"],
        properties: {
          overallScore: { type: Type.INTEGER },
          critique: { type: Type.STRING },
          fixes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                section: { type: Type.STRING },
                issue: { type: Type.STRING },
                fix: { type: Type.STRING }
              }
            }
          }
        }
      }
    }
  });

  if (!response.text) throw new Error("Failed to roast resume");
  return JSON.parse(response.text) as RoastResult;
}

export async function generatePhase2Data(resume: ResumeData, targetRole: string) {
  const model = "gemini-3-flash-preview";
  
  const prompt = `You are helping a candidate with Phase 2: Refinement & Job Targeting.
  
  Resume: ${JSON.stringify(resume)}
  Target Job Role: ${targetRole}
  
  TASKS:
  1. PORTFOLIO DESCRIPTIONS: For each project in the resume, generate a polished 3-5 sentence description suitable for a personal website or GitHub README. Focus on: problem solved, tech used, contribution, and impact.
  2. JOB-ROLE TARGETING: 
     a. Rewrite the resume professional summary to perfectly match the target role.
     b. Suggest updated tech skills (languages, frameworks, tools) optimized for this role based ONLY on what is in the resume, but re-prioritized or slightly expanded with relevant secondary keywords if appropriate.
     c. List 3-5 specific job keywords the user should naturally weave into their resume.
  3. COVER LETTER: Draft a role-specific cover letter based on the resume and the target job role.
  
  Return the result in JSON format.`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        required: ["portfolioDescriptions", "tailoredResume", "coverLetter"],
        properties: {
          portfolioDescriptions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                projectTitle: { type: Type.STRING },
                polishedDescription: { type: Type.STRING }
              }
            }
          },
          tailoredResume: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              techSkills: {
                type: Type.OBJECT,
                properties: {
                  languages: { type: Type.ARRAY, items: { type: Type.STRING } },
                  frameworks: { type: Type.ARRAY, items: { type: Type.STRING } },
                  tools: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              },
              jobKeywords: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          },
          coverLetter: { type: Type.STRING }
        }
      }
    }
  });

  if (!response.text) throw new Error("Failed to generate Phase 2 data");
  return JSON.parse(response.text);
}

export async function getNextInterviewQuestion(
  resume: ResumeData, 
  history: InterviewMessage[], 
  type: InterviewType, 
  difficulty: Difficulty
) {
  const model = "gemini-3-flash-preview";
  const prompt = `You are a professional HR/Technical interviewer.
  
  RESUME: ${JSON.stringify(resume)}
  INTERVIEW TYPE: ${type}
  DIFFICULTY: ${difficulty}
  HISTORY: ${JSON.stringify(history)}
  
  TASK: Generate the NEXT single interview question based ONLY on the resume and the interview settings. 
  Follow these rules:
  - DO NOT repeat questions.
  - Keep it professional and realistic.
  - If Behavioral, use STAR-based prompts.
  - If Technical, stick to the stack listed in the resume.
  - Keep the question concise.
  
  Return the question in JSON.`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        required: ["question"],
        properties: {
          question: { type: Type.STRING }
        }
      }
    }
  });

  if (!response.text) throw new Error("Failed to get interview question");
  return JSON.parse(response.text).question as string;
}

export async function evaluateInterviewAnswer(
  question: string,
  answer: string,
  resume: ResumeData
) {
  const model = "gemini-3-flash-preview";
  const prompt = `Evaluate the candidate's answer to the following interview question based on their resume.
  
  QUESTION: ${question}
  ANSWER: ${answer}
  RESUME: ${JSON.stringify(resume)}
  
  TASK: Provide critical but supportive HR-style feedback. 
  Return in JSON format.`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        required: ["clarity", "confidence", "strengths", "improvements", "betterPhrasing"],
        properties: {
          clarity: { type: Type.NUMBER, description: "Scale 1-5" },
          confidence: { type: Type.NUMBER, description: "Scale 1-5" },
          strengths: { type: Type.STRING },
          improvements: { type: Type.STRING },
          betterPhrasing: { type: Type.STRING }
        }
      }
    }
  });

  if (!response.text) throw new Error("Failed to evaluate answer");
  return JSON.parse(response.text) as InterviewFeedback;
}

export async function generateFinalScorecard(
  resume: ResumeData,
  history: InterviewMessage[]
) {
  const model = "gemini-3-flash-preview";
  const prompt = `Generate a final interview scorecard based on the following session history and resume.
  
  RESUME: ${JSON.stringify(resume)}
  HISTORY: ${JSON.stringify(history)}
  
  Return in JSON format.`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        required: ["overallScore", "categoryBreakdown", "topStrengths", "topWeaknesses", "verdict"],
        properties: {
          overallScore: { type: Type.NUMBER },
          categoryBreakdown: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                score: { type: Type.NUMBER }
              }
            }
          },
          topStrengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          topWeaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
          verdict: { type: Type.STRING, enum: ["Ready to apply", "Almost there", "Needs more prep"] }
        }
      }
    }
  });

  if (!response.text) throw new Error("Failed to generate scorecard");
  return JSON.parse(response.text) as InterviewScorecard;
}
