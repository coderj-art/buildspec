// Shared types for BuildSpec

export type BuildType =
  | "internal"
  | "team"
  | "client"
  | "app_to_sell"
  | "not_sure";

export type Experience =
  | "nothing"
  | "no_code"
  | "ai_assisted"
  | "experienced";

export type WeeklyHours = "under_3" | "three_to_seven" | "seven_plus";

export type MonthlyBudget = "zero" | "under_50" | "fifty_to_200" | "over_200";

export type FormFactor =
  | "web_app"
  | "mobile"
  | "slack_bot"
  | "cli"
  | "email_flow"
  | "background";

export interface QuizAnswers {
  name: string;
  email: string;
  build_type: BuildType | "";
  business: string;
  who_uses: string;
  problem: string;
  experience: Experience | "";
  weekly_hours: WeeklyHours | "";
  integrations: string;
  success_criteria: string;
  monthly_budget: MonthlyBudget | "";
  form_factor: FormFactor | "";
}

export const INITIAL_ANSWERS: QuizAnswers = {
  name: "",
  email: "",
  build_type: "",
  business: "",
  who_uses: "",
  problem: "",
  experience: "",
  weekly_hours: "",
  integrations: "",
  success_criteria: "",
  monthly_budget: "",
  form_factor: "",
};

export interface BuildSpec {
  name: string;
  oneLiner: string;
  targetUser: string;
  coreFeatures: [string, string, string];
  whyThisFirst: string;
  techStack: {
    primary: string;
    mcps: string[];
    integrations: string[];
  };
  milestones: {
    week: number;
    title: string;
    deliverable: string;
  }[];
  estimatedTimeToShip: string;
}

export type Stage =
  | "landing"
  | "email"
  | "otp"
  | "question"
  | "generating"
  | "spec"
  | "error";
