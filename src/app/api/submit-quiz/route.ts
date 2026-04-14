import { z } from "zod";

const MOCK_MODE =
  process.env.CONVERTKIT_API_KEY === "your_kit_v4_api_key_here";

const submitSchema = z.object({
  subscriberId: z.number(),
  firstName: z.string(),
  formData: z.object({
    email: z.string(),
    business_type: z.string(),
    monthly_revenue: z.string(),
    bottleneck: z.string(),
    ai_comfort: z.string(),
    time_available: z.string(),
    budget: z.string(),
    implementation_preference: z.string(),
    success_vision: z.string(),
    industry: z.string(),
    urgency: z.string(),
  }),
  segment: z.enum(["diy", "dwy", "dfy"]),
  scores: z.object({
    diy: z.number(),
    dwy: z.number(),
    dfy: z.number(),
  }),
  isOverride: z.boolean(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = submitSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { success: false, error: "Invalid data" },
        { status: 400 }
      );
    }

    const { subscriberId, firstName, formData, segment, scores, isOverride } =
      parsed.data;

    // Always push to Airtable (even in mock mode for Kit)
    try {
      const { pushToAirtable, isHotLead } = await import("@/lib/airtable");
      await pushToAirtable({
        ...formData,
        name: firstName,
        segment,
        isOverride,
        scores,
      });
      console.log(`[AIRTABLE] Lead pushed: ${formData.email} (${segment})`);

      // Check for hot DFY lead
      if (isHotLead({ segment, monthly_revenue: formData.monthly_revenue, budget: formData.budget, urgency: formData.urgency })) {
        console.log(`[HOT LEAD] ${firstName} (${formData.email}) - Revenue: ${formData.monthly_revenue}, Budget: ${formData.budget}, Urgency: ${formData.urgency}`);
        const { sendHotLeadAlert } = await import("@/lib/slack");
        await sendHotLeadAlert({
          name: firstName,
          email: formData.email,
          monthly_revenue: formData.monthly_revenue,
          budget: formData.budget,
          urgency: formData.urgency,
          industry: formData.industry,
          bottleneck: formData.bottleneck,
          ai_comfort: formData.ai_comfort,
          implementation_preference: formData.implementation_preference,
          segment,
        });
      }
    } catch (e) {
      console.error("Failed to push to Airtable:", e);
    }

    if (MOCK_MODE) {
      console.log(`[MOCK] Submit quiz for subscriber ${subscriberId}:`);
      console.log(`  Segment: ${segment} (override: ${isOverride})`);
      console.log(`  Scores: DIY=${scores.diy} DWY=${scores.dwy} DFY=${scores.dfy}`);
      console.log(`  Answers:`, formData);
      return Response.json({ success: true });
    }

    // Update Kit subscriber with quiz answers as custom fields
    const { updateSubscriberFields } = await import("@/lib/convertkit");
    await updateSubscriberFields(
      subscriberId,
      {
        quiz_business_type: formData.business_type,
        quiz_monthly_revenue: formData.monthly_revenue,
        quiz_bottleneck: formData.bottleneck,
        quiz_ai_comfort: formData.ai_comfort,
        quiz_time_available: formData.time_available,
        quiz_budget: formData.budget,
        quiz_implementation_preference: formData.implementation_preference,
        quiz_success_vision: formData.success_vision,
        quiz_industry: formData.industry,
        quiz_urgency: formData.urgency,
        quiz_segment: segment,
        quiz_score_diy: String(scores.diy),
        quiz_score_dwy: String(scores.dwy),
        quiz_score_dfy: String(scores.dfy),
        quiz_override: String(isOverride),
      },
      firstName
    );

    // Tag subscriber with segment
    // Note: Tag IDs need to be created in Kit first.
    // For now, we store the segment as a custom field.
    // TODO: Add tagSubscriber calls once tag IDs are configured

    // Log to Google Sheets
    try {
      const sheetsUrl = new URL("/api/log-to-sheets", request.url);
      await fetch(sheetsUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          name: firstName,
          segment,
          scores,
          isOverride,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (e) {
      console.error("Failed to log to sheets:", e);
      // Don't fail the main request if sheets logging fails
    }

    return Response.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected error";
    console.error("Submit quiz error:", message);
    return Response.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
