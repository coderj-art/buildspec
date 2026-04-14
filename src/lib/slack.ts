const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

const LABELS: Record<string, Record<string, string>> = {
  monthly_revenue: {
    pre_revenue: "Pre-revenue", under_5k: "Under $5K/mo", "5k_20k": "$5K-$20K/mo",
    "20k_50k": "$20K-$50K/mo", "50k_100k": "$50K-$100K/mo", "100k_plus": "$100K+/mo",
  },
  budget: {
    free: "Free/low-cost", "100_500": "$100-$500/mo", "500_2000": "$500-$2K/mo",
    "2000_plus": "$2K+/mo", project: "$5K-$15K+ project",
  },
  urgency: {
    asap: "ASAP", "30_days": "Next 30 days", "90_days": "Next 90 days", exploring: "Just exploring",
  },
  industry: {
    professional_services: "Professional Services", ecommerce: "E-commerce", saas: "SaaS/Tech",
    health: "Health/Wellness", real_estate: "Real Estate", local_service: "Local Service",
    creator: "Creator/Influencer", other: "Other",
  },
  bottleneck: {
    marketing: "Marketing", operations: "Operations", need_app: "Build an App",
    customer_support: "Customer Support", not_sure: "Not Sure",
  },
  ai_comfort: {
    advanced: "Already using AI daily", clear: "Knows what they need", general_idea: "General idea",
    exploring: "Tried ChatGPT", unclear: "Doesn't understand yet",
  },
};

function label(field: string, value: string): string {
  return LABELS[field]?.[value] || value;
}

export async function sendHotLeadAlert(data: {
  name: string;
  email: string;
  monthly_revenue: string;
  budget: string;
  urgency: string;
  industry: string;
  bottleneck: string;
  ai_comfort: string;
  implementation_preference: string;
  segment: string;
}) {
  if (!SLACK_WEBHOOK_URL) {
    console.log("[SLACK] No webhook URL configured. Skipping.");
    return;
  }

  const response = await fetch(SLACK_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "HOT LEAD",
          },
        },
        {
          type: "section",
          fields: [
            { type: "mrkdwn", text: `*Name:*\n${data.name}` },
            { type: "mrkdwn", text: `*Email:*\n${data.email}` },
            { type: "mrkdwn", text: `*Revenue:*\n${label("monthly_revenue", data.monthly_revenue)}` },
            { type: "mrkdwn", text: `*Willing to spend:*\n${label("budget", data.budget)}` },
            { type: "mrkdwn", text: `*Urgency:*\n${label("urgency", data.urgency)}` },
            { type: "mrkdwn", text: `*Industry:*\n${label("industry", data.industry)}` },
          ],
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Biggest Time Leak:* ${label("bottleneck", data.bottleneck)}\n*AI Readiness:* ${label("ai_comfort", data.ai_comfort)}\n*Wants:* ${data.implementation_preference === "dfy" ? "Done-For-You" : data.implementation_preference === "dwy" ? "Done-With-You" : "DIY"}`,
          },
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: { type: "plain_text", text: "Open Airtable" },
              url: `https://airtable.com/${process.env.AIRTABLE_BASE_ID}`,
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    console.error("[SLACK] Failed to send alert:", await response.text());
  }
}
