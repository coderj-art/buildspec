import { cookies } from "next/headers";
import {
  verifySessionToken,
  SESSION_COOKIE_NAME,
} from "@/lib/jwt";
import {
  findOrCreateSubscriber,
  updateSubscriberFields,
  tagSubscriberByNames,
} from "@/lib/convertkit";
import type { BuildSpec, QuizAnswers } from "@/lib/types";

const MODEL = "claude-sonnet-4-5";
const MAX_TOKENS = 1200;

const SYSTEM_PROMPT = `You are a product strategist for James Wild's AI Founders Studio.
Given a person's answers about what they want to build, produce a crisp one-page build spec for exactly what they should build first with Claude Code.

Rules:
- Be specific, not generic. Reference their exact problem, user, and business.
- Match the ambition and stack to their experience, time budget, and monthly budget.
- Prefer simple, shippable scope over impressive, bloated scope.
- Tech stack must suit their form factor and budget. Don't recommend $200/mo tools to someone on $0.
- The 5 milestones must be genuinely shippable weekly increments.
- Voice: British casual. Direct. No fluff. No corporate speak. No em dashes.
- Never fabricate. If an answer is sparse, keep the spec tight rather than invented.

Call the emit_spec tool with your final output. Do not respond in plain text.`;

const EMIT_SPEC_TOOL = {
  name: "emit_spec",
  description:
    "Emit the final build spec. Always use this tool to respond. Do not produce plain text.",
  input_schema: {
    type: "object",
    required: [
      "name",
      "oneLiner",
      "targetUser",
      "coreFeatures",
      "whyThisFirst",
      "techStack",
      "milestones",
      "estimatedTimeToShip",
    ],
    properties: {
      name: {
        type: "string",
        description: "Short punchy product name (2-4 words).",
      },
      oneLiner: {
        type: "string",
        description:
          "One-line promise in under 120 characters. Specific. References the user and the outcome.",
      },
      targetUser: {
        type: "string",
        description: "The specific person who uses this tool.",
      },
      coreFeatures: {
        type: "array",
        description: "Exactly 3 core features that ship in v1.",
        minItems: 3,
        maxItems: 3,
        items: { type: "string" },
      },
      whyThisFirst: {
        type: "string",
        description:
          "2-3 sentences explaining why THIS build, given their experience, time, and budget. Reference their answers directly.",
      },
      techStack: {
        type: "object",
        required: ["primary", "mcps", "integrations"],
        properties: {
          primary: {
            type: "string",
            description:
              "Primary runtime / framework. Default 'Claude Code' unless their form factor clearly needs something else.",
          },
          mcps: {
            type: "array",
            description:
              "Specific MCPs or skills they should set up. Keep list short (2-4).",
            items: { type: "string" },
          },
          integrations: {
            type: "array",
            description:
              "External services to wire up (Resend, Stripe, Slack, etc). Can be empty.",
            items: { type: "string" },
          },
        },
      },
      milestones: {
        type: "array",
        description:
          "Exactly 5 weekly milestones from zero to shipped. Sized to their weekly hours.",
        minItems: 5,
        maxItems: 5,
        items: {
          type: "object",
          required: ["week", "title", "deliverable"],
          properties: {
            week: { type: "number" },
            title: { type: "string" },
            deliverable: {
              type: "string",
              description: "Concrete thing they'll have by end of the week.",
            },
          },
        },
      },
      estimatedTimeToShip: {
        type: "string",
        description:
          "Realistic time to ship based on weekly hours, e.g. '5 weeks at 5h/week'.",
      },
    },
  },
};

function formatAnswersForPrompt(name: string, answers: QuizAnswers): string {
  return [
    `Name: ${name}`,
    `Build type: ${answers.build_type}`,
    `Business: ${answers.business}`,
    `Who uses it: ${answers.who_uses}`,
    `Problem: ${answers.problem}`,
    `Experience: ${answers.experience}`,
    `Weekly hours: ${answers.weekly_hours}`,
    `Integrations: ${answers.integrations || "(none specified)"}`,
    `Success criteria: ${answers.success_criteria}`,
    `Monthly budget: ${answers.monthly_budget}`,
    `Form factor: ${answers.form_factor}`,
  ].join("\n");
}

interface AnthropicToolUseBlock {
  type: "tool_use";
  name: string;
  input: BuildSpec;
}

interface AnthropicResponse {
  content: Array<AnthropicToolUseBlock | { type: string }>;
  stop_reason: string;
}

async function callAnthropic(
  apiKey: string,
  name: string,
  answers: QuizAnswers
): Promise<BuildSpec> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      tools: [EMIT_SPEC_TOOL],
      tool_choice: { type: "tool", name: "emit_spec" },
      messages: [
        {
          role: "user",
          content: formatAnswersForPrompt(name, answers),
        },
      ],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Anthropic API ${res.status}: ${errText}`);
  }

  const data = (await res.json()) as AnthropicResponse;
  const toolBlock = data.content.find(
    (b): b is AnthropicToolUseBlock =>
      b.type === "tool_use" && "name" in b && b.name === "emit_spec"
  );

  if (!toolBlock) {
    throw new Error("Model did not call emit_spec tool");
  }
  return toolBlock.input;
}

function mockSpec(name: string, answers: QuizAnswers): BuildSpec {
  return {
    name: "ProposalPilot",
    oneLiner: "Turn client briefs into ready-to-send proposals in under 10 minutes.",
    targetUser: answers.who_uses || name || "You",
    coreFeatures: [
      "Paste or upload a client brief",
      "Generate a tailored proposal draft in your voice",
      "Export to PDF or copy to Google Docs",
    ],
    whyThisFirst: `Given you're at ${answers.experience || "your"} level with ${answers.weekly_hours || "limited"} per week, this is the sharpest knife you can ship in the time you have. It attacks ${answers.problem || "your biggest time drain"} directly.`,
    techStack: {
      primary: "Claude Code",
      mcps: ["Filesystem", "Gmail"],
      integrations:
        answers.integrations && answers.integrations.trim().length > 0
          ? answers.integrations
              .split(/,|\band\b/)
              .map((s) => s.trim())
              .filter(Boolean)
          : ["Resend"],
    },
    milestones: [
      { week: 1, title: "Skeleton script", deliverable: "Claude Code project that reads a brief and outputs a plain-text draft." },
      { week: 2, title: "Voice match", deliverable: "Prompt tuned on 3 of your past proposals." },
      { week: 3, title: "Export path", deliverable: "PDF export and Google Doc export wired." },
      { week: 4, title: "One-command run", deliverable: "Single command turns brief into proposal." },
      { week: 5, title: "First real use", deliverable: "Used on a live client brief. Shipped." },
    ],
    estimatedTimeToShip: `5 weeks at ${answers.weekly_hours || "3-7h"}/week`,
  };
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const session = await verifySessionToken(token);

    if (!session) {
      return Response.json(
        { ok: false, error: "Not verified. Please re-enter your code." },
        { status: 401 }
      );
    }

    const body = (await request.json()) as { answers: QuizAnswers };
    const answers = body.answers;

    if (!answers || typeof answers !== "object") {
      return Response.json(
        { ok: false, error: "Missing answers" },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    const spec: BuildSpec = apiKey
      ? await callAnthropic(apiKey, session.name, answers)
      : mockSpec(session.name, answers);

    // Kit: tag and set custom fields (non-fatal if it fails)
    if (process.env.CONVERTKIT_API_KEY) {
      try {
        const subscriber = await findOrCreateSubscriber(
          session.email,
          session.name
        );
        await updateSubscriberFields(
          subscriber.id,
          {
            buildspec_name: spec.name,
            buildspec_oneliner: spec.oneLiner,
            buildspec_generated_at: new Date().toISOString(),
          },
          session.name
        );
        await tagSubscriberByNames(subscriber.id, [
          "buildspec_completed",
          `build_type_${answers.build_type}`,
          `experience_${answers.experience}`,
          `time_${answers.weekly_hours}`,
          `budget_${answers.monthly_budget}`,
          `form_${answers.form_factor}`,
        ]);
      } catch (e) {
        console.error("Kit integration failed:", e);
      }
    }

    return Response.json({ ok: true, spec });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    console.error("generate-spec error:", message);
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
