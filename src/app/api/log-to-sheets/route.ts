export async function POST(request: Request) {
  try {
    const body = await request.json();
    const sheetId = process.env.GOOGLE_SHEETS_ID;

    if (!sheetId) {
      console.log("[SHEETS] No GOOGLE_SHEETS_ID configured. Logging to console:");
      console.log(JSON.stringify(body, null, 2));
      return Response.json({ success: true, mock: true });
    }

    // Prepare row data
    const row = [
      body.timestamp || new Date().toISOString(),
      body.name || "",
      body.email || "",
      body.business_type || "",
      body.monthly_revenue || "",
      body.bottleneck || "",
      body.ai_comfort || "",
      body.time_available || "",
      body.budget || "",
      body.implementation_preference || "",
      body.success_vision || "",
      body.industry || "",
      body.urgency || "",
      body.segment || "",
      body.isOverride ? "Yes" : "No",
      `DIY:${body.scores?.diy || 0} DWY:${body.scores?.dwy || 0} DFY:${body.scores?.dfy || 0}`,
      body.source || "",
    ];

    // Use Google Sheets API to append row
    // This uses a service account or API key approach
    // For now, log to console until Sheets is configured
    console.log("[SHEETS] Would append row:", row);

    // TODO: Implement Google Sheets API call
    // Option 1: Use gws CLI via child_process
    // Option 2: Use googleapis npm package
    // Option 3: Use Google Sheets API directly with fetch

    return Response.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected error";
    console.error("Sheets logging error:", message);
    return Response.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
