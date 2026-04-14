"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  INITIAL_FORM_DATA,
  getStepByNumber,
  getProgressInfo,
  type FormData,
} from "@/lib/quiz-config";
import { calculateSegment } from "@/lib/scoring";
import {
  trackSurveyStart,
  trackSurveyAnswer,
  trackStepView,
  trackBackClick,
  trackFbLead,
  trackFbCompleteRegistration,
} from "@/lib/analytics";
import { ProgressBar } from "./progress-bar";
import { LandingStep } from "./landing-step";
import { EmailStep } from "./email-step";
import { TextInputStep } from "./text-input-step";
import { SingleSelectStep } from "./single-select-step";
import { EmailGateForm } from "./email-gate-form";
import { DiyResult } from "./results/diy-result";
import { DwyResult } from "./results/dwy-result";
import { DfyResult } from "./results/dfy-result";
import { AnalysingStep } from "./analysing-step";

const STORAGE_KEY = "business-quiz-state";

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 200 : -200,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -200 : 200,
    opacity: 0,
  }),
};

export function QuizContainer() {
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [direction, setDirection] = useState(1);
  const [stepHistory, setStepHistory] = useState<number[]>([0]);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [llmInsight, setLlmInsight] = useState("");
  const [emailGateCompleted, setEmailGateCompleted] = useState(false);

  // Restore from localStorage on mount
  useEffect(() => {
    setMounted(true);
    // Clear any old quiz state from the previous quiz-funnel
    localStorage.removeItem("quiz-funnel-state");
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Validate saved data has the right shape
        if (parsed.formData && typeof parsed.formData.business_type !== "undefined") {
          setFormData(parsed.formData);
          setCurrentStep(parsed.currentStep);
          setStepHistory(parsed.stepHistory);
        } else {
          // Old/invalid data, clear it
          localStorage.removeItem(STORAGE_KEY);
          const sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
          setFormData((prev) => ({ ...prev, sessionId }));
          trackSurveyStart(sessionId);
        }
      } else {
        const sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        setFormData((prev) => ({ ...prev, sessionId }));
        trackSurveyStart(sessionId);
      }
    } catch {
      const sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      setFormData((prev) => ({ ...prev, sessionId }));
    }
  }, []);

  // Persist to localStorage on state changes
  useEffect(() => {
    if (!mounted) return;
    if (currentStep === 13) return; // Don't persist results
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ formData, currentStep, stepHistory })
    );
  }, [formData, currentStep, stepHistory, mounted]);

  const logAnswer = useCallback(
    (fieldName: string, answer: string | string[]) => {
      fetch("/api/log-step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: formData.sessionId,
          step: currentStep,
          fieldName,
          answer,
          subscriberId: formData.subscriberId,
        }),
      }).catch(console.error);
    },
    [formData.sessionId, formData.subscriberId, currentStep]
  );

  const navigateToStep = useCallback(
    (nextStep: number, dir: number = 1) => {
      setDirection(dir);
      setStepHistory((prev) =>
        dir > 0 ? [...prev, nextStep] : prev.slice(0, -1)
      );
      setCurrentStep(nextStep);
      trackStepView(nextStep);
    },
    []
  );

  // After Q10, trigger analysing
  const handleLastQuestionAnswer = useCallback(
    (fieldName: string, value: string | string[]) => {
      const newFormData = {
        ...formData,
        [fieldName]: value,
      };
      const result = calculateSegment(newFormData);
      const finalFormData = {
        ...newFormData,
        segment: result.segment,
      };
      setFormData(finalFormData);
      trackSurveyAnswer(currentStep, fieldName, value);
      logAnswer(fieldName, value);
      localStorage.removeItem(STORAGE_KEY);

      // Go to analysing screen
      setIsAnalysing(true);
    },
    [formData, currentStep, logAnswer]
  );

  const handleNext = useCallback(
    (fieldName: string, value: string | string[]) => {
      // If this is Q10 (last question), trigger analysing flow
      if (currentStep === 10) {
        handleLastQuestionAnswer(fieldName, value);
        return;
      }

      const newFormData = {
        ...formData,
        [fieldName]: value,
      };
      setFormData(newFormData);

      trackSurveyAnswer(currentStep, fieldName, value);
      logAnswer(fieldName, value);

      const stepConfig = getStepByNumber(currentStep);
      if (!stepConfig) return;

      const nextStep = stepConfig.getNextStep(value, newFormData);
      if (nextStep !== null) {
        navigateToStep(nextStep);
      }
    },
    [formData, currentStep, logAnswer, navigateToStep, handleLastQuestionAnswer]
  );

  const handleBack = useCallback(() => {
    if (stepHistory.length <= 1) return;
    trackBackClick(currentStep);
    const previousStep = stepHistory[stepHistory.length - 2];
    navigateToStep(previousStep, -1);
  }, [stepHistory, currentStep, navigateToStep]);

  // After email gate is submitted on results page
  const handleEmailGateSubmit = useCallback(
    (email: string, name: string, subscriberId: number) => {
      const finalFormData = {
        ...formData,
        email,
        name,
        subscriberId,
      };
      setFormData(finalFormData);
      trackSurveyAnswer(11, "email", email);
      trackFbLead();
      trackFbCompleteRegistration(formData.segment);

      // Submit all quiz data to API
      fetch("/api/submit-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscriberId,
          firstName: name,
          formData: finalFormData,
          segment: formData.segment,
          scores: calculateSegment(finalFormData).scores,
          isOverride: calculateSegment(finalFormData).isOverride,
        }),
      }).catch(console.error);

      // Send PDF report via email
      fetch("/api/send-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          segment: formData.segment,
          business_type: formData.business_type,
          monthly_revenue: formData.monthly_revenue,
          bottleneck: formData.bottleneck,
          industry: formData.industry,
          ai_comfort: formData.ai_comfort,
          time_available: formData.time_available,
          budget: formData.budget,
          urgency: formData.urgency,
          insight: llmInsight,
          scores: calculateSegment(formData).scores,
        }),
      }).catch(console.error);

      // Unlock results
      setEmailGateCompleted(true);
    },
    [formData, llmInsight]
  );

  const handleAnalysingComplete = useCallback(
    (insight: string) => {
      setLlmInsight(insight);
      setIsAnalysing(false);
      navigateToStep(13);
    },
    [navigateToStep]
  );

  const renderStep = () => {
    const stepConfig = getStepByNumber(currentStep);
    if (!stepConfig) return null;

    switch (stepConfig.type) {
      case "landing":
        return <LandingStep onStart={() => navigateToStep(1)} />;

      case "email":
        // This step is no longer used in the flow (email is now a gate on results)
        return null;

      case "text-input":
        return (
          <TextInputStep
            question={stepConfig.question}
            subtitle={stepConfig.subtitle}
            placeholder={stepConfig.placeholder || ""}
            onSubmit={(value) => handleNext(stepConfig.fieldName, value)}
            defaultValue={
              (formData[stepConfig.fieldName as keyof FormData] as string) || ""
            }
          />
        );

      case "single-select":
        return (
          <SingleSelectStep
            question={stepConfig.question}
            subtitle={stepConfig.subtitle}
            options={stepConfig.options || []}
            onSelect={(value) => handleNext(stepConfig.fieldName, value)}
          />
        );

      case "results": {
        const segment = formData.segment || "dwy";
        const resultPage = segment === "dfy"
          ? <DfyResult formData={formData} insight={llmInsight} />
          : segment === "diy"
            ? <DiyResult formData={formData} insight={llmInsight} />
            : <DwyResult formData={formData} insight={llmInsight} />;

        if (!emailGateCompleted) {
          return (
            <div className="relative min-h-screen overflow-hidden">
              {/* Blurred results behind */}
              <div className="blur-md opacity-40 pointer-events-none select-none">
                {resultPage}
              </div>
              {/* Email gate overlay - fixed center */}
              <div className="fixed inset-0 z-10 flex items-center justify-center px-5">
                <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 sm:p-10 space-y-6 border border-border">
                  <div className="space-y-3 text-center">
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-[1.1]">
                      Your results are ready.
                    </h2>
                    <p className="text-muted-foreground text-base">
                      Enter your details to reveal your personalised report.
                    </p>
                  </div>
                  <EmailGateForm onSubmit={handleEmailGateSubmit} />
                </div>
              </div>
            </div>
          );
        }

        return resultPage;
      }

      default:
        return null;
    }
  };

  // Analysing screen (between name submit and results)
  if (isAnalysing) {
    return (
      <AnalysingStep
        onComplete={handleAnalysingComplete}
        formData={formData as unknown as Record<string, unknown>}
        segment={formData.segment}
      />
    );
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Landing page and results get full-width layouts
  if (currentStep === 0 || currentStep === 13) {
    return (
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentStep}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className={currentStep === 13 ? "min-h-screen" : ""}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>
    );
  }

  // Quiz questions (1-10) and email/name capture (11-12) get centered layout
  const showProgress = currentStep >= 1 && currentStep <= 10;
  const showBack = currentStep >= 1 && currentStep <= 12;
  const progressInfo = getProgressInfo(currentStep);

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-8">
      <div className="w-full max-w-xl">
        {showBack && (
          <button
            onClick={handleBack}
            className="mb-8 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer font-medium"
          >
            &#8592; Back
          </button>
        )}

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {showProgress && (
          <div className="mt-12">
            <ProgressBar
              current={progressInfo.current}
              total={progressInfo.total}
            />
          </div>
        )}
      </div>
    </main>
  );
}
