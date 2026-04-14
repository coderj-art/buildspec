const KIT_API_BASE = "https://api.kit.com/v4";

interface KitSubscriber {
  id: number;
  email_address: string;
  first_name: string | null;
  state: string;
  fields: Record<string, string | null>;
}

interface SubscriberResponse {
  subscriber: KitSubscriber;
}

export async function createSubscriber(
  email: string,
  firstName?: string
): Promise<SubscriberResponse> {
  const response = await fetch(`${KIT_API_BASE}/subscribers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Kit-Api-Key": process.env.CONVERTKIT_API_KEY!,
    },
    body: JSON.stringify({
      email_address: email,
      first_name: firstName || undefined,
      state: "active",
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`ConvertKit API error: ${response.status} - ${error}`);
  }

  return response.json();
}

export async function updateSubscriberFields(
  subscriberId: number,
  fields: Record<string, string>,
  firstName?: string
): Promise<SubscriberResponse> {
  const body: Record<string, unknown> = { fields };
  if (firstName) {
    body.first_name = firstName;
  }

  const response = await fetch(
    `${KIT_API_BASE}/subscribers/${subscriberId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Kit-Api-Key": process.env.CONVERTKIT_API_KEY!,
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`ConvertKit API error: ${response.status} - ${error}`);
  }

  return response.json();
}

export async function tagSubscriber(
  subscriberId: number,
  tagId: number
): Promise<void> {
  const response = await fetch(
    `${KIT_API_BASE}/tags/${tagId}/subscribers`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Kit-Api-Key": process.env.CONVERTKIT_API_KEY!,
      },
      body: JSON.stringify({ subscriber_id: subscriberId }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`ConvertKit tag error: ${response.status} - ${error}`);
  }
}
