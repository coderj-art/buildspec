export type StepType =
  | "landing"
  | "email"
  | "text-input"
  | "single-select"
  | "results";

export interface QuizOption {
  label: string;
  value: string;
}

export interface QuizStep {
  id: string;
  stepNumber: number;
  type: StepType;
  question: string;
  subtitle?: string;
  options?: QuizOption[];
  placeholder?: string;
  fieldName: string;
  required: boolean;
  isQuizQuestion: boolean; // true = counts toward progress bar
  getNextStep: (answer: string | string[], formData: FormData) => number | null;
}

export interface FormData {
  email: string;
  subscriberId: number | null;
  sessionId: string;
  name: string;
  business_type: string;
  monthly_revenue: string;
  bottleneck: string;
  ai_comfort: string;
  time_available: string;
  budget: string;
  implementation_preference: string;
  success_vision: string;
  industry: string;
  urgency: string;
  segment: string; // "diy" | "dwy" | "dfy"
}

export const INITIAL_FORM_DATA: FormData = {
  email: "",
  subscriberId: null,
  sessionId: "",
  name: "",
  business_type: "",
  monthly_revenue: "",
  bottleneck: "",
  ai_comfort: "",
  time_available: "",
  budget: "",
  implementation_preference: "",
  success_vision: "",
  industry: "",
  urgency: "",
  segment: "",
};

// Step numbers:
// 0 = Landing page
// 1-10 = Quiz questions (Q1-Q10)
// 11 = Email capture
// 12 = Name capture
// 13 = Results

export const QUIZ_STEPS: QuizStep[] = [
  // Step 0: Landing page
  {
    id: "landing",
    stepNumber: 0,
    type: "landing",
    question: "Discover Your AI Implementation Path",
    subtitle:
      "Answer 10 quick questions and get a personalized recommendation for how to implement AI in your business.",
    fieldName: "landing",
    required: false,
    isQuizQuestion: false,
    getNextStep: () => 1,
  },

  // Q1: Business type
  {
    id: "business_type",
    stepNumber: 1,
    type: "single-select",
    question: "How many people run your business right now?",
    fieldName: "business_type",
    required: true,
    isQuizQuestion: true,
    options: [
      { label: "Just me. I wear every hat.", value: "solo" },
      { label: "Small team (1-5 people)", value: "small_team" },
      { label: "Growing team (6-20 people)", value: "growing" },
      { label: "20+ people", value: "established" },
    ],
    getNextStep: () => 2,
  },

  // Q2: Monthly revenue
  {
    id: "monthly_revenue",
    stepNumber: 2,
    type: "single-select",
    question: "What's your monthly revenue?",
    fieldName: "monthly_revenue",
    required: true,
    isQuizQuestion: true,
    options: [
      { label: "Pre-revenue / just starting", value: "pre_revenue" },
      { label: "Under $5K/month", value: "under_5k" },
      { label: "$5K - $20K/month", value: "5k_20k" },
      { label: "$20K - $50K/month", value: "20k_50k" },
      { label: "$50K - $100K/month", value: "50k_100k" },
      { label: "$100K+/month", value: "100k_plus" },
    ],
    getNextStep: () => 3,
  },

  // Q3: What would you want AI to handle?
  {
    id: "bottleneck",
    stepNumber: 3,
    type: "single-select",
    question: "Where are you spending the most time you wish you weren't?",
    fieldName: "bottleneck",
    required: true,
    isQuizQuestion: true,
    options: [
      {
        label: "Marketing. Content, emails, socials. The grind never stops.",
        value: "marketing",
      },
      {
        label: "Operations. I'm duct-taping tools together just to keep things moving.",
        value: "operations",
      },
      {
        label: "I need to build an app or product but I'm not technical.",
        value: "need_app",
      },
      {
        label: "Customer support. Answering the same questions over and over.",
        value: "customer_support",
      },
      {
        label: "Honestly, all of it. Everything falls on me.",
        value: "not_sure",
      },
    ],
    getNextStep: () => 4,
  },

  // Q4: AI readiness / clarity
  {
    id: "ai_comfort",
    stepNumber: 4,
    type: "single-select",
    question: "Where are you at with AI right now?",
    fieldName: "ai_comfort",
    required: true,
    isQuizQuestion: true,
    options: [
      {
        label: "I'm already using AI daily in my business.",
        value: "advanced",
      },
      {
        label: "I know what I need. Just need someone to build it.",
        value: "clear",
      },
      {
        label: "I have ideas but I'm stuck on where to start.",
        value: "general_idea",
      },
      {
        label: "I've tried ChatGPT but nothing's stuck in my actual business.",
        value: "exploring",
      },
      {
        label: "I keep hearing about it but I don't know what's real and what's hype.",
        value: "unclear",
      },
    ],
    getNextStep: () => 5,
  },

  // Q5: Time available
  {
    id: "time_available",
    stepNumber: 5,
    type: "single-select",
    question:
      "How much time do you realistically have each week to work on this?",
    fieldName: "time_available",
    required: true,
    isQuizQuestion: true,
    options: [
      { label: "Almost none. I'm already maxed out.", value: "under_2hrs" },
      { label: "A few hours if I plan ahead.", value: "2_5hrs" },
      { label: "5-10 hours. I can make time for the right thing.", value: "5_10hrs" },
      { label: "10+ hours. I'm ready to go all in.", value: "10plus_hrs" },
    ],
    getNextStep: () => 6,
  },

  // Q6: Budget
  {
    id: "budget",
    stepNumber: 6,
    type: "single-select",
    question: "What could you invest if you knew it would save you 10x the time?",
    fieldName: "budget",
    required: true,
    isQuizQuestion: true,
    options: [
      { label: "Keep it free or close to it.", value: "free" },
      { label: "$100-$500/month", value: "100_500" },
      { label: "$500-$2,000/month", value: "500_2000" },
      { label: "$2,000+/month", value: "2000_plus" },
      { label: "$5K-$15K+ as a one-off project", value: "project" },
    ],
    getNextStep: () => 7,
  },

  // Q7: Implementation preference (OVERRIDE QUESTION)
  {
    id: "implementation_preference",
    stepNumber: 7,
    type: "single-select",
    question: "If you could snap your fingers, how would this get done?",
    fieldName: "implementation_preference",
    required: true,
    isQuizQuestion: true,
    options: [
      { label: "Teach me. I'll build it myself.", value: "diy" },
      {
        label: "Guide me. I'll do the work but I need direction.",
        value: "dwy",
      },
      { label: "Just build it for me. I'll focus on running my business.", value: "dfy" },
      { label: "I don't know yet.", value: "not_sure" },
    ],
    getNextStep: () => 8,
  },

  // Q8: Success vision
  {
    id: "success_vision",
    stepNumber: 8,
    type: "single-select",
    question: "Picture your business 90 days from now. What changed?",
    fieldName: "success_vision",
    required: true,
    isQuizQuestion: true,
    options: [
      {
        label: "I finally have systems doing the repetitive stuff for me.",
        value: "basic_automations",
      },
      {
        label: "My marketing and ops run without me touching them every day.",
        value: "systematized",
      },
      {
        label: "I have AI handling entire parts of my business.",
        value: "custom_systems",
      },
      { label: "I've launched an app or product I've been sitting on.", value: "launched_app" },
    ],
    getNextStep: () => 9,
  },

  // Q9: Industry (data only, not scored)
  {
    id: "industry",
    stepNumber: 9,
    type: "single-select",
    question: "What industry is your business in?",
    fieldName: "industry",
    required: true,
    isQuizQuestion: true,
    options: [
      { label: "Professional services / consulting", value: "professional_services" },
      { label: "E-commerce / retail", value: "ecommerce" },
      { label: "SaaS / tech", value: "saas" },
      { label: "Health / wellness", value: "health" },
      { label: "Real estate", value: "real_estate" },
      { label: "Local service business (trades, cleaning, etc.)", value: "local_service" },
      { label: "Content creator / influencer", value: "creator" },
      { label: "Other", value: "other" },
    ],
    getNextStep: () => 10,
  },

  // Q10: Urgency
  {
    id: "urgency",
    stepNumber: 10,
    type: "single-select",
    question: "How urgently do you need this sorted?",
    fieldName: "urgency",
    required: true,
    isQuizQuestion: true,
    options: [
      { label: "Yesterday. I'm losing time every day I wait.", value: "asap" },
      { label: "This month. I want to move soon.", value: "30_days" },
      { label: "Next few months. No rush.", value: "90_days" },
      { label: "Just looking around for now.", value: "exploring" },
    ],
    getNextStep: () => 11,
  },

  // Step 11: Email + Name capture (combined)
  {
    id: "email_capture",
    stepNumber: 11,
    type: "email",
    question: "Your results are ready.",
    subtitle: "Enter your details to see your personalised report.",
    placeholder: "Enter your email address",
    fieldName: "email",
    required: true,
    isQuizQuestion: false,
    getNextStep: () => 13,
  },

  // Step 13: Results
  {
    id: "results",
    stepNumber: 13,
    type: "results",
    question: "Your Results",
    fieldName: "results",
    required: false,
    isQuizQuestion: false,
    getNextStep: () => null,
  },
];

export function getStepByNumber(stepNumber: number): QuizStep | undefined {
  return QUIZ_STEPS.find((s) => s.stepNumber === stepNumber);
}

export function getProgressInfo(currentStep: number): {
  current: number;
  total: number;
} {
  const total = 10; // Always 10 quiz questions

  if (currentStep < 1 || currentStep > 10) {
    return { current: 0, total };
  }

  return { current: currentStep, total };
}
