import { renderToBuffer } from "@react-pdf/renderer";
import { Resend } from "resend";
import React from "react";
import { QuizReport } from "@/lib/pdf-report";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name, email, segment, business_type, monthly_revenue,
      bottleneck, industry, ai_comfort, time_available, budget,
      urgency, insight, scores,
    } = body;

    if (!resend) {
      console.log("[RESEND] No API key configured. Skipping PDF email.");
      console.log(`[MOCK] Would send PDF report to ${email}`);
      return Response.json({ success: true, mock: true });
    }

    // Generate PDF
    const reportElement = React.createElement(QuizReport, {
      data: {
        name, email, segment, business_type, monthly_revenue,
        bottleneck, industry, ai_comfort, time_available, budget,
        urgency, insight,
        scores: scores || { diy: 0, dwy: 0, dfy: 0 },
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfBuffer = await renderToBuffer(reportElement as any);

    // Send email with PDF attached
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "James Wild <james@beyondseven.io>",
      to: email,
      subject: `Your quiz results, ${name}`,
      html: `
        <div style="font-family: Helvetica, Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 40px 20px;">
          <p style="font-size: 16px; color: #0a0a0a; line-height: 1.6;">Hey ${name},</p>
          <p style="font-size: 16px; color: #3f3f46; line-height: 1.6;">Your personalised quiz results are attached as a PDF.</p>
          <p style="font-size: 16px; color: #3f3f46; line-height: 1.6;">${insight || ""}</p>
          <p style="font-size: 16px; color: #3f3f46; line-height: 1.6;">Own the day</p>
          <p style="font-size: 16px; color: #0a0a0a; font-weight: bold;">JW</p>
          <hr style="border: none; border-top: 1px solid #dcdce0; margin: 30px 0;" />
          <p style="font-size: 12px; color: #a1a1aa;">Beyond Seven Studios | beyondseven.io</p>
        </div>
      `,
      attachments: [
        {
          filename: `quiz-results-${name.toLowerCase().replace(/\s+/g, "-")}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    if (error) {
      console.error("[RESEND] Error:", error);
      return Response.json({ success: false, error: error.message }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    console.error("Send report error:", message);
    return Response.json({ success: false, error: message }, { status: 500 });
  }
}
