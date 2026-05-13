export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  location: string;
}

export interface Education {
  degree: string;
  school: string;
  year: string;
  gpa?: string;
}

export interface Project {
  title: string;
  description: string;
  technologies: string[];
}

export interface Experience {
  role: string;
  company: string;
  duration: string;
  description: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  education: Education[];
  techSkills: {
    languages: string[];
    frameworks: string[];
    tools: string[];
  };
  projects: Project[];
  experience: Experience[];
  certifications: string[];
  targetRole?: string;
  template: "student" | "software" | "qa" | "data";
}

export interface PortfolioDescription {
  projectTitle: string;
  polishedDescription: string;
}

export interface TailoredResumeResult {
  summary: string;
  techSkills: {
    languages: string[];
    frameworks: string[];
    tools: string[];
  };
  jobKeywords: string[];
}

export interface Phase2Data {
  portfolioDescriptions: PortfolioDescription[];
  tailoredResume: TailoredResumeResult;
  coverLetter?: string;
}

export type InterviewType = "Technical" | "HR" | "Mixed";
export type Difficulty = "Entry-level" | "Mid-level" | "Competitive";

export interface InterviewFeedback {
  clarity: number;
  confidence: number;
  strengths: string;
  improvements: string;
  betterPhrasing: string;
}

export interface InterviewMessage {
  role: "ai" | "user";
  content: string;
  feedback?: InterviewFeedback;
}

export interface InterviewScorecard {
  overallScore: number;
  categoryBreakdown: { category: string; score: number }[];
  topStrengths: string[];
  topWeaknesses: string[];
  verdict: "Ready to apply" | "Almost there" | "Needs more prep";
}

export interface RoastResult {
  overallScore: number;
  critique: string;
  fixes: { section: string; issue: string; fix: string }[];
}
