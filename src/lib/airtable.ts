const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || "Leads";

// Map raw quiz values to human-readable Airtable select options
const LABELS: Record<string, Record<string, string>> = {
  business_type: {
    solo: "Solo/Freelancer",
    small_team: "Small Team (1-5)",
    growing: "Growing (6-20)",
    established: "Established (20+)",
  },
  monthly_revenue: {
    pre_revenue: "Pre-revenue",
    under_5k: "Under $5K",
    "5k_20k": "$5K-$20K",
    "20k_50k": "$20K-$50K",
    "50k_100k": "$50K-$100K",
    "100k_plus": "$100K+",
  },
  bottleneck: {
    marketing: "Marketing",
    operations: "Operations",
    need_app: "Build an App",
    customer_support: "Customer Support",
    not_sure: "Not Sure",
  },
  ai_comfort: {
    advanced: "Already Using AI Daily",
    clear: "Know Exactly What I Need",
    general_idea: "General Idea",
    exploring: "Tried ChatGPT",
    unclear: "Don't Understand Yet",
  },
  time_available: {
    under_2hrs: "Under 2hrs",
    "2_5hrs": "2-5hrs",
    "5_10hrs": "5-10hrs",
    "10plus_hrs": "10+ hrs",
  },
  budget: {
    free: "Free/Low-cost",
    "100_500": "$100-$500/mo",
    "500_2000": "$500-$2K/mo",
    "2000_plus": "$2K+/mo",
    project: "$5K-$15K+ Project",
  },
  implementation_preference: {
    diy: "DIY",
    dwy: "Done-With-You",
    dfy: "Done-For-You",
    not_sure: "Not Sure",
  },
  success_vision: {
    basic_automations: "Basic Automations",
    systematized: "Systematized",
    custom_systems: "Custom AI Systems",
    launched_app: "Launched App",
  },
  industry: {
    professional_services: "Professional Services",
    ecommerce: "E-commerce",
    saas: "SaaS/Tech",
    health: "Health/Wellness",
    real_estate: "Real Estate",
    local_service: "Local Service",
    creator: "Creator/Influencer",
    other: "Other",
  },
  urgency: {
    asap: "ASAP",
    "30_days": "Next 30 Days",
    "90_days": "Next 90 Days",
    exploring: "Just Exploring",
  },
};

function label(field: string, value: string): string {
  return LABELS[field]?.[value] || value;
}

export async function pushToAirtable(data: {
  name: string;
  email: string;
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
  segment: string;
  isOverride: boolean;
  scores: { diy: number; dwy: number; dfy: number };
  insight?: string;
}) {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    console.log("[AIRTABLE] No API key or base ID configured. Skipping.");
    return null;
  }

  const response = await fetch(
    `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        records: [
          {
            fields: {
              Timestamp: new Date().toISOString(),
              Name: data.name,
              Email: data.email,
              "Business Type": label("business_type", data.business_type),
              "Monthly Revenue": label("monthly_revenue", data.monthly_revenue),
              "Biggest Time Leak": label("bottleneck", data.bottleneck),
              "AI Readiness": label("ai_comfort", data.ai_comfort),
              "Time Available": label("time_available", data.time_available),
              Budget: label("budget", data.budget),
              "Implementation Preference": label("implementation_preference", data.implementation_preference),
              "90-Day Vision": label("success_vision", data.success_vision),
              Industry: label("industry", data.industry),
              Urgency: label("urgency", data.urgency),
              Segment: data.segment.toUpperCase(),
              Override: data.isOverride,
              Scores: `DIY:${data.scores.diy} DWY:${data.scores.dwy} DFY:${data.scores.dfy}`,
              "LLM Insight": data.insight || "",
              Source: "",
            },
          },
        ],
        typecast: true,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Airtable error: ${response.status} - ${error}`);
  }

  return response.json();
}

export function isHotLead(data: {
  segment: string;
  monthly_revenue: string;
  budget: string;
  urgency: string;
}): boolean {
  if (data.segment !== "dfy") return false;

  const highRevenue = ["20k_50k", "50k_100k", "100k_plus"].includes(
    data.monthly_revenue
  );
  const highBudget = ["2000_plus", "project"].includes(data.budget);
  const urgent = ["asap", "30_days"].includes(data.urgency);

  const signals = [highRevenue, highBudget, urgent].filter(Boolean).length;
  return signals >= 2;
}
