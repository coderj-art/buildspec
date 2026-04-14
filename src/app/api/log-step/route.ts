const MOCK_MODE =
  process.env.CONVERTKIT_API_KEY === "your_kit_v4_api_key_here";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId, step, fieldName, answer, subscriberId } = body;

    if (MOCK_MODE) {
      console.log(
        `[MOCK] Step ${step}: ${fieldName} = ${JSON.stringify(answer)} (session: ${sessionId})`
      );
      return Response.json({ success: true });
    }

    // Update Kit subscriber fields in real-time if subscriber exists
    if (
      subscriberId &&
      fieldName !== "email" &&
      fieldName !== "name" &&
      fieldName !== "landing" &&
      fieldName !== "results"
    ) {
      try {
        const { updateSubscriberFields } = await import("@/lib/convertkit");
        const fieldValue = Array.isArray(answer) ? answer.join(", ") : answer;
        await updateSubscriberFields(subscriberId, {
          [`quiz_${fieldName}`]: fieldValue,
        });
      } catch (e) {
        console.error("Failed to update Kit subscriber:", e);
      }
    }

    // Log to console for analytics
    console.log(
      `Quiz step ${step}: ${fieldName} = ${JSON.stringify(answer)} (session: ${sessionId})`
    );

    return Response.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected error";
    return Response.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
