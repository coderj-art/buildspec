import { z } from "zod";
// import { createSubscriber } from "@/lib/convertkit";

const MOCK_MODE = process.env.CONVERTKIT_API_KEY === "your_kit_v4_api_key_here";

const subscribeSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = subscribeSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    if (MOCK_MODE) {
      console.log(`[MOCK] Subscribe: ${parsed.data.email}`);
      return Response.json({
        success: true,
        subscriberId: Math.floor(Math.random() * 1000000),
      });
    }

    const { createSubscriber } = await import("@/lib/convertkit");
    const result = await createSubscriber(parsed.data.email);
    return Response.json({
      success: true,
      subscriberId: result.subscriber.id,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected error";
    return Response.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
