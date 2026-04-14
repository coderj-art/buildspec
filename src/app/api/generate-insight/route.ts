export async function POST(request: Request) {
  try {
    const { formData, segment } = await request.json();
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      // Mock mode: return a realistic mock insight after a short delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const name = formData.name || "there";
      const mockInsights: Record<string, string> = {
        diy: `${name}, you've got the time and the mindset to build this yourself. Most people in your position waste months jumping between tools. You just need a system that tells you what to build first and in what order.`,
        dwy: `${name}, you're not short on ambition. You're short on direction. You've got a sense of where AI fits but you're stuck on the how. The fastest path for someone in your position is guided support, not another YouTube rabbit hole.`,
        dfy: `${name}, your business is generating revenue but your time isn't. Every hour you spend on tasks AI could handle is an hour you're not spending on growth. You don't need to learn this. You need it built.`,
      };
      return Response.json({
        success: true,
        insight: mockInsights[segment] || mockInsights.dwy,
      });
    }

    const answerSummary = [
      `Business: ${formData.business_type}`,
      `Revenue: ${formData.monthly_revenue}`,
      `Biggest time drain: ${formData.bottleneck}`,
      `AI readiness: ${formData.ai_comfort}`,
      `Time available: ${formData.time_available}`,
      `Budget: ${formData.budget}`,
      `Preference: ${formData.implementation_preference}`,
      `90-day vision: ${formData.success_vision}`,
      `Industry: ${formData.industry}`,
      `Urgency: ${formData.urgency}`,
    ].join("\n");

    const segmentLabel =
      segment === "dfy"
        ? "done-for-you (agency)"
        : segment === "dwy"
          ? "done-with-you (guided)"
          : "do-it-yourself (community)";

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 300,
        messages: [
          {
            role: "user",
            content: `You are writing a personalised quiz result for a business owner. Based on their answers below, write 2-3 short sentences that feel like a real person analysed their specific situation. Be direct, specific, and conversational. No fluff. No buzzwords. British casual tone.

Their result pathway: ${segmentLabel}
Their name: ${formData.name || "there"}

Their answers:
${answerSummary}

Rules:
- Write to them directly using "you"
- Reference their specific answers (their industry, their time situation, their bottleneck)
- No emojis. No em dashes.
- Sound like a mate giving honest advice, not a sales pitch
- 2-3 sentences max. Keep it tight.
- Do NOT use the words: leverage, unlock, streamline, elevate, empower, comprehensive, innovative, game-changer, cutting-edge, supercharge`,
          },
        ],
      }),
    });

    if (!res.ok) {
      console.error("Anthropic API error:", await res.text());
      return Response.json({ success: false, insight: "" });
    }

    const data = await res.json();
    const insight = data.content?.[0]?.text || "";

    return Response.json({ success: true, insight });
  } catch (error) {
    console.error("Generate insight error:", error);
    return Response.json({ success: false, insight: "" });
  }
}
