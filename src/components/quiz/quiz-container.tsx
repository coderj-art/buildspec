"use client";

import { useReducer, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  INITIAL_ANSWERS,
  type QuizAnswers,
  type BuildSpec,
  type Stage,
} from "@/lib/types";
import { TOTAL_QUESTIONS, getQuestion } from "@/lib/quiz-config";
import { ProgressBar } from "./progress-bar";
import { LandingStep } from "./landing-step";
import { OtpVerifyStep } from "./otp-verify-step";
import { SingleSelectStep } from "./single-select-step";
import { TextareaStep } from "./textarea-step";
import { SpecResult } from "./spec-result";

interface State {
  stage: Stage;
  currentQuestionId: number;
  name: string;
  email: string;
  answers: QuizAnswers;
  spec: BuildSpec | null;
  errorMessage: string;
  direction: 1 | -1;
}

type Action =
  | { type: "EMAIL_SENT"; name: string; email: string }
  | { type: "OTP_VERIFIED" }
  | { type: "ANSWER"; field: keyof QuizAnswers; value: string }
  | { type: "BACK" }
  | { type: "START_GENERATE" }
  | { type: "SPEC_READY"; spec: BuildSpec }
  | { type: "ERROR"; message: string };

const initialState: State = {
  stage: "landing",
  currentQuestionId: 1,
  name: "",
  email: "",
  answers: INITIAL_ANSWERS,
  spec: null,
  errorMessage: "",
  direction: 1,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "EMAIL_SENT":
      return {
        ...state,
        stage: "otp",
        name: action.name,
        email: action.email,
        answers: { ...state.answers, name: action.name, email: action.email },
        direction: 1,
      };
    case "OTP_VERIFIED":
      return { ...state, stage: "question", currentQuestionId: 1, direction: 1 };
    case "ANSWER": {
      const nextAnswers = { ...state.answers, [action.field]: action.value };
      if (state.currentQuestionId >= TOTAL_QUESTIONS) {
        return { ...state, answers: nextAnswers };
      }
      return {
        ...state,
        answers: nextAnswers,
        currentQuestionId: state.currentQuestionId + 1,
        direction: 1,
      };
    }
    case "BACK": {
      if (state.stage === "otp") {
        return { ...state, stage: "landing", direction: -1, errorMessage: "" };
      }
      if (state.stage === "question" && state.currentQuestionId > 1) {
        return {
          ...state,
          currentQuestionId: state.currentQuestionId - 1,
          direction: -1,
        };
      }
      return state;
    }
    case "START_GENERATE":
      return { ...state, stage: "generating", direction: 1 };
    case "SPEC_READY":
      return { ...state, stage: "spec", spec: action.spec, direction: 1 };
    case "ERROR":
      return { ...state, errorMessage: action.message };
    default:
      return state;
  }
}

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 200 : -200,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -200 : 200,
    opacity: 0,
  }),
};

export function QuizContainer() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const sendVerification = useCallback(
    async (name: string, email: string) => {
      const res = await fetch("/api/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (!data.ok) {
        throw new Error(data.error || "Failed to send code");
      }
      if (data.bypassed) {
        // Server bypassed OTP: JWT cookie already set, jump straight to quiz
        dispatch({ type: "EMAIL_SENT", name, email });
        dispatch({ type: "OTP_VERIFIED" });
        return;
      }
      dispatch({ type: "EMAIL_SENT", name, email });
    },
    []
  );

  const verifyOtp = useCallback(
    async (code: string) => {
      const res = await fetch("/api/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: state.name, email: state.email, code }),
      });
      const data = await res.json();
      if (!data.ok) {
        throw new Error(data.error || "Code invalid");
      }
      dispatch({ type: "OTP_VERIFIED" });
    },
    [state.name, state.email]
  );

  const resendCode = useCallback(async () => {
    await sendVerification(state.name, state.email);
  }, [sendVerification, state.name, state.email]);

  const generateSpec = useCallback(async (answers: QuizAnswers) => {
    dispatch({ type: "START_GENERATE" });
    try {
      const res = await fetch("/api/generate-spec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Failed to generate spec");
      dispatch({ type: "SPEC_READY", spec: data.spec });
    } catch (err) {
      dispatch({
        type: "ERROR",
        message: err instanceof Error ? err.message : "Something went wrong.",
      });
      dispatch({ type: "SPEC_READY", spec: mockFallback(answers) });
    }
  }, []);

  const handleAnswer = useCallback(
    (field: keyof QuizAnswers, value: string) => {
      const isLast = state.currentQuestionId >= TOTAL_QUESTIONS;
      dispatch({ type: "ANSWER", field, value });
      if (isLast) {
        const finalAnswers: QuizAnswers = {
          ...state.answers,
          [field]: value,
        } as QuizAnswers;
        generateSpec(finalAnswers);
      }
    },
    [state.answers, state.currentQuestionId, generateSpec]
  );

  // Landing (handles email submission inline)
  if (state.stage === "landing") {
    return <LandingStep onEmailSubmit={sendVerification} />;
  }

  // Spec (full screen)
  if (state.stage === "spec" && state.spec) {
    return (
      <main className="min-h-screen bg-background px-6">
        <SpecResult spec={state.spec} name={state.name} />
      </main>
    );
  }

  const showProgress = state.stage === "question";
  const showBack =
    state.stage === "otp" ||
    (state.stage === "question" && state.currentQuestionId > 1);

  return (
    <main className="h-screen bg-background flex flex-col">
      {/* Top bar */}
      <div className="flex-shrink-0 px-6 py-5">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4 min-h-[36px]">
          <button
            type="button"
            onClick={() => dispatch({ type: "BACK" })}
            className={`text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer ${
              showBack ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            ← Back
          </button>
          {showProgress && (
            <div className="flex-1 max-w-sm">
              <ProgressBar
                current={state.currentQuestionId}
                total={TOTAL_QUESTIONS}
              />
            </div>
          )}
          <div className="w-12" />
        </div>
      </div>

      {/* Centered content */}
      <div className="flex-1 flex items-center justify-center px-6 pb-10 min-h-0 overflow-y-auto">
        <AnimatePresence mode="wait" custom={state.direction}>
          <motion.div
            key={`${state.stage}-${state.currentQuestionId}`}
            custom={state.direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full flex justify-center"
          >
            {state.stage === "otp" && (
              <OtpVerifyStep
                email={state.email}
                onVerify={verifyOtp}
                onResend={resendCode}
                onBack={() => dispatch({ type: "BACK" })}
              />
            )}

            {state.stage === "question" &&
              (() => {
                const q = getQuestion(state.currentQuestionId);
                if (!q) return null;
                if (q.type === "radio" && q.options) {
                  return (
                    <SingleSelectStep
                      question={q.question}
                      subtitle={q.subtitle}
                      options={q.options}
                      onSelect={(v) => handleAnswer(q.fieldName, v)}
                    />
                  );
                }
                return (
                  <TextareaStep
                    question={q.question}
                    subtitle={q.subtitle}
                    placeholder={q.placeholder}
                    required={q.required}
                    initialValue={state.answers[q.fieldName] as string}
                    onSubmit={(v) => handleAnswer(q.fieldName, v)}
                  />
                );
              })()}

            {state.stage === "generating" && (
              <div className="space-y-6 text-center py-20">
                <div className="relative w-16 h-16 mx-auto">
                  <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
                  <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">
                    Building your spec, {state.name}…
                  </h2>
                  <p className="text-muted-foreground">
                    About 20 seconds. Hang tight.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}

// Last-resort mock if the API fails completely
function mockFallback(answers: QuizAnswers): BuildSpec {
  return {
    name: "Your First Build",
    oneLiner: "A simple tool to solve your biggest time drain.",
    targetUser: answers.who_uses || "You",
    coreFeatures: [
      "Capture the input",
      "Process with Claude",
      "Return the result",
    ],
    whyThisFirst:
      "We had trouble generating a personalised spec. Try again in a moment.",
    techStack: {
      primary: "Claude Code",
      mcps: [],
      integrations: [],
    },
    milestones: [
      { week: 1, title: "Setup", deliverable: "Project scaffold." },
      { week: 2, title: "Core logic", deliverable: "First working pass." },
      { week: 3, title: "UI", deliverable: "Usable interface." },
      { week: 4, title: "Polish", deliverable: "Fix rough edges." },
      { week: 5, title: "Ship", deliverable: "Live and in use." },
    ],
    estimatedTimeToShip: "5 weeks",
  };
}
