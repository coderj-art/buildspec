import React from "react";
import path from "path";
import { Document, Page, Text, View, Image, StyleSheet, Font, Link } from "@react-pdf/renderer";


const fontsDir = path.join(process.cwd(), "public", "fonts");

Font.register({
  family: "Neue Montreal",
  fonts: [
    { src: path.join(fontsDir, "NeueMontreal-Light.otf"), fontWeight: 300 },
    { src: path.join(fontsDir, "NeueMontreal-Regular.otf"), fontWeight: 400 },
    { src: path.join(fontsDir, "NeueMontreal-Medium.otf"), fontWeight: 500 },
    { src: path.join(fontsDir, "NeueMontreal-Bold.otf"), fontWeight: 700 },
  ],
});

const dark = "#0a0a0b";
const darkBorder = "#1e1e22";
const darkLabel = "#52525b";
const white = "#ffffff";
const lightBg = "#f7f7f8";
const lightBorder = "#dcdce0";
const lightMuted = "#71717a";
const lightText = "#0a0a0a";

const s = StyleSheet.create({
  page: {
    flexDirection: "row",
    fontFamily: "Neue Montreal",
  },
  left: {
    width: 210,
    backgroundColor: dark,
    padding: 40,
    paddingTop: 50,
    paddingBottom: 50,
    justifyContent: "flex-start",
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 6,
    backgroundColor: "#141416",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  logoText: {
    color: white,
    fontSize: 10,
    fontWeight: 700,
  },
  brandName: {
    color: "#52525b",
    fontSize: 9,
    marginBottom: 30,
  },
  divider: {
    height: 1,
    backgroundColor: darkBorder,
    marginVertical: 20,
    width: "100%",
  },
  sectionLabel: {
    color: darkLabel,
    fontSize: 8,
    letterSpacing: 2.5,
    textTransform: "uppercase" as const,
    marginBottom: 8,
  },
  resultHeadline: {
    color: white,
    fontSize: 18,
    fontWeight: 700,
    lineHeight: 1.3,
    marginBottom: 4,
  },
  insightText: {
    color: "#a1a1aa",
    fontSize: 9,
    lineHeight: 1.7,
  },
  ctaText: {
    color: "#a1a1aa",
    fontSize: 9,
    lineHeight: 1.7,
  },
  right: {
    flex: 1,
    backgroundColor: lightBg,
    padding: 40,
    paddingTop: 50,
    paddingBottom: 50,
  },
  rightLabel: {
    color: lightMuted,
    fontSize: 8,
    letterSpacing: 2.5,
    textTransform: "uppercase" as const,
    marginBottom: 12,
  },
  rightHeading: {
    color: lightText,
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 16,
  },
  grid: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 8,
    marginBottom: 25,
  },
  gridItem: {
    width: "47%",
    backgroundColor: white,
    borderRadius: 6,
    padding: 10,
    borderWidth: 1,
    borderColor: lightBorder,
  },
  gridLabel: {
    color: lightMuted,
    fontSize: 7,
    letterSpacing: 1.5,
    textTransform: "uppercase" as const,
    marginBottom: 3,
  },
  gridValue: {
    color: lightText,
    fontSize: 9,
    fontWeight: 700,
  },
  rightDivider: {
    height: 1,
    backgroundColor: lightBorder,
    marginVertical: 18,
    width: "100%",
  },
  standoutText: {
    color: "#3f3f46",
    fontSize: 9,
    lineHeight: 1.7,
    marginBottom: 6,
  },
  recommendationBox: {
    backgroundColor: white,
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: lightBorder,
  },
  recommendationTitle: {
    color: lightText,
    fontSize: 11,
    fontWeight: 700,
    marginBottom: 4,
  },
  recommendationDetail: {
    color: lightMuted,
    fontSize: 9,
    lineHeight: 1.6,
  },
  footer: {
    position: "absolute" as const,
    bottom: 30,
    right: 40,
    color: "#a1a1aa",
    fontSize: 7,
  },
});

const LABELS: Record<string, Record<string, string>> = {
  business_type: {
    solo: "Solo / Freelancer",
    small_team: "Small Team (1-5)",
    growing: "Growing (6-20)",
    established: "Established (20+)",
  },
  monthly_revenue: {
    pre_revenue: "Pre-revenue",
    under_5k: "Under $5K/mo",
    "5k_20k": "$5K-$20K/mo",
    "20k_50k": "$20K-$50K/mo",
    "50k_100k": "$50K-$100K/mo",
    "100k_plus": "$100K+/mo",
  },
  bottleneck: {
    marketing: "Marketing",
    operations: "Operations",
    need_app: "Build an App",
    customer_support: "Customer Support",
    not_sure: "Not Sure",
  },
  industry: {
    professional_services: "Professional Services",
    ecommerce: "E-commerce",
    saas: "SaaS / Tech",
    health: "Health / Wellness",
    real_estate: "Real Estate",
    local_service: "Local Service",
    creator: "Creator / Influencer",
    other: "Other",
  },
  ai_comfort: {
    advanced: "Using AI Daily",
    clear: "Knows What They Need",
    general_idea: "General Idea",
    exploring: "Tried ChatGPT",
    unclear: "Early Stage",
  },
  time_available: {
    under_2hrs: "Under 2hrs/week",
    "2_5hrs": "2-5hrs/week",
    "5_10hrs": "5-10hrs/week",
    "10plus_hrs": "10+ hrs/week",
  },
  budget: {
    free: "Free / Low-cost",
    "100_500": "$100-$500/mo",
    "500_2000": "$500-$2K/mo",
    "2000_plus": "$2K+/mo",
    project: "$5K-$15K+ Project",
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

interface ReportData {
  name: string;
  email: string;
  segment: string;
  business_type: string;
  monthly_revenue: string;
  bottleneck: string;
  industry: string;
  ai_comfort: string;
  time_available: string;
  budget: string;
  urgency: string;
  insight: string;
  scores: { diy: number; dwy: number; dfy: number };
}

function getHeadline(segment: string, name: string): string {
  if (segment === "dfy") return `You don't need to learn this, ${name}. You need it done.`;
  if (segment === "dwy") return `You want to do the work, ${name}. Just not alone.`;
  return `You're a builder, ${name}.`;
}

function getStandouts(data: ReportData): string[] {
  const standouts: string[] = [];

  if (data.segment === "dfy") {
    if (["20k_50k", "50k_100k", "100k_plus"].includes(data.monthly_revenue)) {
      standouts.push("Your revenue means you can invest in systems that free up your time instead of spending months learning to build them.");
    }
    if (["under_2hrs", "2_5hrs"].includes(data.time_available)) {
      standouts.push("You don't have 10 hours a week to learn a new skill. Every hour you spend building is an hour not spent on revenue.");
    }
    if (data.urgency === "asap") {
      standouts.push("You want to move now, not in three months after a course.");
    }
  } else if (data.segment === "dwy") {
    if (data.ai_comfort === "general_idea") {
      standouts.push("You have a sense of where AI fits. The gap isn't knowledge, it's knowing which steps to take in which order.");
    }
    if (data.business_type === "solo") {
      standouts.push("Solo operators get the most out of guided support. No team to bounce ideas off means the community fills that gap.");
    }
  } else {
    if (["5_10hrs", "10plus_hrs"].includes(data.time_available)) {
      standouts.push("You've got time to put into this. That matters more than most people think.");
    }
    if (["clear", "general_idea", "advanced"].includes(data.ai_comfort)) {
      standouts.push("You already have a sense of how AI fits into your business.");
    }
  }

  if (standouts.length === 0) {
    standouts.push("You're taking action by completing this assessment. That puts you ahead of most.");
  }

  return standouts;
}

export function QuizReport({ data }: { data: ReportData }) {
  const headline = getHeadline(data.segment, data.name);
  const standouts = getStandouts(data);

  const offerName = data.segment === "dfy" ? "Beyond Seven Studios" : "AI Founders Studio";
  const offerCtaText = data.segment === "dfy"
    ? "Book a free strategy call"
    : "Join the community";
  const offerCtaUrl = data.segment === "dfy"
    ? "https://calendly.com/jamesmwild"
    : "https://www.skool.com/ai-apps-builder-6217/about";
  const offerPrice = data.segment === "dfy" ? "Free consultation" : "$69/month";

  const recommendation = data.segment === "dfy"
    ? "Based on your answers, the fastest path is having us build your AI systems. Book a free 30-minute strategy call and we'll map out exactly what to build first."
    : data.segment === "dwy"
      ? "You want to do the work but with the right guidance. The community gives you step-by-step courses, weekly live sessions, and direct support."
      : "You have the drive and time to build this yourself. The community gives you the system, templates, and other builders to learn alongside.";

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* LEFT PANEL */}
        <View style={s.left}>
          <Image src={path.join(process.cwd(), "public", "b7s-logo-white.png")} style={{ width: 120, height: 30, objectFit: "contain" as const }} />

          <View style={s.divider} />

          <Text style={s.sectionLabel}>Your Result</Text>
          <Text style={s.resultHeadline}>{headline}</Text>

          <View style={s.divider} />

          <Text style={s.sectionLabel}>Personalised Insight</Text>
          <Text style={s.insightText}>{data.insight}</Text>

          <View style={s.divider} />

          <Text style={s.sectionLabel}>Next Step</Text>
          <Text style={{ ...s.ctaText, fontWeight: 700, color: white, marginBottom: 2 }}>{offerName}</Text>
          <Text style={s.ctaText}>{offerPrice}</Text>
          <Link src={offerCtaUrl} style={{ ...s.ctaText, marginTop: 8, color: "#a1a1aa", textDecoration: "underline" }}>{offerCtaText}</Link>
        </View>

        {/* RIGHT PANEL */}
        <View style={s.right}>
          <Text style={s.rightLabel}>Your Answers</Text>

          <View style={s.grid}>
            <View style={s.gridItem}>
              <Text style={s.gridLabel}>Business</Text>
              <Text style={s.gridValue}>{label("business_type", data.business_type)}</Text>
            </View>
            <View style={s.gridItem}>
              <Text style={s.gridLabel}>Revenue</Text>
              <Text style={s.gridValue}>{label("monthly_revenue", data.monthly_revenue)}</Text>
            </View>
            <View style={s.gridItem}>
              <Text style={s.gridLabel}>Time Leak</Text>
              <Text style={s.gridValue}>{label("bottleneck", data.bottleneck)}</Text>
            </View>
            <View style={s.gridItem}>
              <Text style={s.gridLabel}>Industry</Text>
              <Text style={s.gridValue}>{label("industry", data.industry)}</Text>
            </View>
            <View style={s.gridItem}>
              <Text style={s.gridLabel}>AI Readiness</Text>
              <Text style={s.gridValue}>{label("ai_comfort", data.ai_comfort)}</Text>
            </View>
            <View style={s.gridItem}>
              <Text style={s.gridLabel}>Time Available</Text>
              <Text style={s.gridValue}>{label("time_available", data.time_available)}</Text>
            </View>
            <View style={s.gridItem}>
              <Text style={s.gridLabel}>Budget</Text>
              <Text style={s.gridValue}>{label("budget", data.budget)}</Text>
            </View>
            <View style={s.gridItem}>
              <Text style={s.gridLabel}>Urgency</Text>
              <Text style={s.gridValue}>{label("urgency", data.urgency)}</Text>
            </View>
          </View>

          <View style={s.rightDivider} />

          <Text style={s.rightLabel}>What Stood Out</Text>
          {standouts.map((text, i) => (
            <Text key={i} style={s.standoutText}>{text}</Text>
          ))}

          <View style={s.rightDivider} />

          <Text style={s.rightLabel}>Our Recommendation</Text>
          <View style={s.recommendationBox}>
            <Text style={s.recommendationTitle}>{offerName}</Text>
            <Text style={s.recommendationDetail}>{recommendation}</Text>
          </View>

          <Link src="https://beyondseven.io" style={{ ...s.footer, textDecoration: "none" }}>beyondseven.io</Link>
        </View>
      </Page>
    </Document>
  );
}
