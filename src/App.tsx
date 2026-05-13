/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import Header from "./components/Header";
import StepForm from "./components/StepForm";
import ResumePreview from "./components/ResumePreview";
import RoastView from "./components/RoastView";
import Phase2View from "./components/Phase2View";
import InterviewView from "./components/InterviewView";
import { Phase2Data, ResumeData, RoastResult } from "./types";
import { generateResumeAI, roastResume, generatePhase2Data } from "./services/geminiService";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Target, Mic } from "lucide-react";
import { cn } from "./lib/utils";

type AppState = "form" | "preview" | "roasting" | "targeting" | "interview";

export default function App() {
  const [state, setState] = useState<AppState>("form");
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [roastData, setRoastData] = useState<RoastResult | null>(null);
  const [phase2Data, setPhase2Data] = useState<Phase2Data | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRoasting, setIsRoasting] = useState(false);
  const [isTargeting, setIsTargeting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleFormComplete = async (partialData: Partial<ResumeData>) => {
    setIsLoading(true);
    try {
      const generated = await generateResumeAI(partialData, partialData.targetRole);
      setResumeData(generated);
      setState("preview");
    } catch (error) {
      console.error("Generation failed:", error);
      alert("Something went wrong with AI generation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoast = async () => {
    if (!resumeData) return;
    setIsRoasting(true);
    try {
      const roast = await roastResume(resumeData);
      setRoastData(roast);
      setState("roasting");
    } catch (error) {
      console.error("Roast failed:", error);
      alert("The HR manager is busy. Try roasting again later.");
    } finally {
      setIsRoasting(false);
    }
  };

  const handleSave = async () => {
    if (!resumeData) return;
    setIsTargeting(true);
    try {
      const p2Data = await generatePhase2Data(resumeData, resumeData.targetRole || "IT Professional");
      setPhase2Data(p2Data);
      setState("targeting");
    } catch (error) {
      console.error("Phase 2 failed:", error);
      alert("Failed to generate targeting assets. Please try again.");
    } finally {
      setIsTargeting(false);
    }
  };

  const steps = [
    { id: 1, title: "Career Path" },
    { id: 2, title: "Persona" },
    { id: 3, title: "Education" },
    { id: 4, title: "Skills" },
    { id: 5, title: "Portfolio" },
    { id: 6, title: "Experience" },
    { id: 7, title: "Certs" }
  ];

  return (
    <div className="h-screen flex flex-col font-sans text-slate-900 overflow-hidden bg-slate-50">
      <Header />
      
      <main className="flex-1 flex overflow-hidden pt-14">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col p-6 shrink-0 hidden lg:flex">
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-6">Progress Tracking</h3>
          
          <div className="space-y-2 mb-8 flex-1">
            {steps.map((s) => (
              <div 
                key={s.id} 
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl border transition-all",
                  state !== "form" && s.id <= 7 ? "bg-green-50 text-green-700 border-green-100" :
                  currentStep === s.id && state === "form" ? "bg-blue-50 text-blue-700 border-blue-100" :
                  currentStep > s.id && state === "form" ? "bg-slate-50 text-slate-500 border-slate-100" :
                  "text-slate-400 border-transparent"
                )}
              >
                <div className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-black shrink-0",
                  state !== "form" && s.id <= 7 ? "border-green-600 bg-green-600 text-white" :
                  currentStep === s.id && state === "form" ? "border-blue-600" :
                  "border-slate-300"
                )}>
                  {s.id}
                </div>
                <span className="text-xs font-bold truncate">{s.title}</span>
              </div>
            ))}
          </div>

          <div className="p-4 bg-slate-900 rounded-2xl text-white">
            <p className="text-[10px] font-black text-blue-400 uppercase tracking-wider">Pro Coach Tip</p>
            <p className="text-[11px] leading-relaxed mt-2 opacity-80">
              {state === "form" ? "Use strong action verbs in your descriptions to stand out." : "Tailor your summary to match the job description's keywords."}
            </p>
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto relative">
          <AnimatePresence mode="wait">
            {state === "form" && (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full"
              >
                <StepForm 
                  onComplete={handleFormComplete} 
                  isLoading={isLoading} 
                  onStepChange={setCurrentStep}
                />
              </motion.div>
            )}

            {state === "preview" && resumeData && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="h-full"
              >
                <ResumePreview 
                  data={resumeData} 
                  onRoast={handleRoast} 
                  onSave={handleSave}
                  isSaving={isSaving}
                />
              </motion.div>
            )}

            {state === "roasting" && roastData && (
              <motion.div
                key="roasting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full"
              >
                <RoastView roast={roastData} onRefresh={handleRoast} onBack={() => setState("preview")} />
              </motion.div>
            )}

            {state === "targeting" && phase2Data && resumeData && (
              <motion.div
                key="targeting"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="h-full"
              >
                <Phase2View 
                  data={phase2Data} 
                  resume={resumeData} 
                  onBack={() => setState("preview")} 
                  onStartInterview={() => setState("interview")}
                />
              </motion.div>
            )}

            {state === "interview" && resumeData && (
              <motion.div
                key="interview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full"
              >
                <InterviewView resume={resumeData} onBack={() => setState("preview")} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Global Loading Overlay for Roasting/Targeting */}
          {(isRoasting || isTargeting) && (
            <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-3xl p-8 text-center max-w-sm space-y-6 shadow-2xl border border-slate-200"
              >
                <div className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center mx-auto",
                  isRoasting ? "bg-orange-100" : "bg-purple-100"
                )}>
                  {isRoasting ? (
                    <Sparkles size={32} className="text-orange-600 animate-pulse" />
                  ) : (
                    <Target size={32} className="text-purple-600 animate-bounce" />
                  )}
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-900">
                    {isRoasting ? "Calling HR Manager..." : "Generating Strategy..."}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {isRoasting 
                      ? "Preparing a painfully honest critique of your resume (professionally speaking)."
                      : "Polishing portfolio descriptions and targeting ATS keywords for your career path."}
                  </p>
                </div>
                <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className={cn("w-1/2 h-full", isRoasting ? "bg-orange-600" : "bg-purple-600")}
                  />
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
