// The 10 BuildSpec questions

import type { QuizAnswers } from "./types";

export type QuestionType = "radio" | "textarea" | "text-optional";

export interface QuizOption {
  label: string;
  value: string;
}

export interface QuizQuestion {
  id: number;
  fieldName: keyof Omit<QuizAnswers, "name" | "email">;
  type: QuestionType;
  question: string;
  subtitle?: string;
  placeholder?: string;
  options?: QuizOption[];
  required: boolean;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    fieldName: "build_type",
    type: "radio",
    question: "What do you want to build?",
    subtitle: "This shapes everything that comes next.",
    required: true,
    options: [
      { label: "An internal tool to save me time", value: "internal" },
      { label: "A tool for my team or business", value: "team" },
      { label: "A tool for my clients or customers to use", value: "client" },
      { label: "An app I want to sell", value: "app_to_sell" },
      { label: "Not sure yet", value: "not_sure" },
    ],
  },
  {
    id: 2,
    fieldName: "business",
    type: "textarea",
    question: "Describe your business or what you do.",
    subtitle: "One or two sentences is enough.",
    placeholder: "e.g. I run a two-person agency that builds websites for cafes and restaurants.",
    required: true,
  },
  {
    id: 3,
    fieldName: "who_uses",
    type: "textarea",
    question: "Who would use this tool?",
    subtitle: "Be specific. The more specific the person, the sharper the build.",
    placeholder: "e.g. Our client onboarding manager. Or small business owners in hospitality.",
    required: true,
  },
  {
    id: 4,
    fieldName: "problem",
    type: "textarea",
    question: "What's the specific problem it should solve?",
    subtitle: "The annoying, repetitive, time-draining thing you want to kill.",
    placeholder: "e.g. Writing client proposals from scratch every time. Takes me two hours each.",
    required: true,
  },
  {
    id: 5,
    fieldName: "experience",
    type: "radio",
    question: "What have you built before?",
    subtitle: "No wrong answer. This sizes the spec to your level.",
    required: true,
    options: [
      { label: "Nothing yet", value: "nothing" },
      { label: "Used no-code tools (Bubble, Lovable, Framer)", value: "no_code" },
      { label: "Shipped something with AI tools (Cursor, Claude)", value: "ai_assisted" },
      { label: "Experienced builder, multiple shipped things", value: "experienced" },
    ],
  },
  {
    id: 6,
    fieldName: "weekly_hours",
    type: "radio",
    question: "How many hours per week can you give this?",
    subtitle: "Realistically. Not aspirationally.",
    required: true,
    options: [
      { label: "Under 3 hours", value: "under_3" },
      { label: "3 to 7 hours", value: "three_to_seven" },
      { label: "7+ hours", value: "seven_plus" },
    ],
  },
  {
    id: 7,
    fieldName: "integrations",
    type: "text-optional",
    question: "Any tools or systems it must integrate with?",
    subtitle: "Optional. Stripe, Slack, Notion, your CRM, Google Sheets, whatever.",
    placeholder: "e.g. HubSpot, Stripe, Google Calendar",
    required: false,
  },
  {
    id: 8,
    fieldName: "success_criteria",
    type: "textarea",
    question: "What does \"done\" look like?",
    subtitle: "How will you know it's working? Be concrete.",
    placeholder: "e.g. Client proposal drafts in under 10 minutes instead of 2 hours.",
    required: true,
  },
  {
    id: 9,
    fieldName: "monthly_budget",
    type: "radio",
    question: "Monthly budget for tools and API costs?",
    subtitle: "We'll tailor the stack to what you can actually afford.",
    required: true,
    options: [
      { label: "$0", value: "zero" },
      { label: "Under $50", value: "under_50" },
      { label: "$50 to $200", value: "fifty_to_200" },
      { label: "$200+", value: "over_200" },
    ],
  },
  {
    id: 10,
    fieldName: "form_factor",
    type: "radio",
    question: "What form factor do you prefer?",
    subtitle: "Shapes the stack recommendation.",
    required: true,
    options: [
      { label: "Web app", value: "web_app" },
      { label: "Mobile app", value: "mobile" },
      { label: "Slack bot", value: "slack_bot" },
      { label: "Command line tool", value: "cli" },
      { label: "Email / form flow", value: "email_flow" },
      { label: "Runs in the background", value: "background" },
    ],
  },
];

export const TOTAL_QUESTIONS = QUIZ_QUESTIONS.length;

export function getQuestion(id: number): QuizQuestion | undefined {
  return QUIZ_QUESTIONS.find((q) => q.id === id);
}
