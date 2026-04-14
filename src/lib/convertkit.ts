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

interface KitTag {
  id: number;
  name: string;
}

function headers(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    "X-Kit-Api-Key": process.env.CONVERTKIT_API_KEY!,
  };
}

export async function createSubscriber(
  email: string,
  firstName?: string
): Promise<SubscriberResponse> {
  const response = await fetch(`${KIT_API_BASE}/subscribers`, {
    method: "POST",
    headers: headers(),
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

export async function findSubscriberByEmail(
  email: string
): Promise<KitSubscriber | null> {
  const url = `${KIT_API_BASE}/subscribers?email_address=${encodeURIComponent(email)}`;
  const response = await fetch(url, { headers: headers() });
  if (!response.ok) return null;
  const data = (await response.json()) as { subscribers?: KitSubscriber[] };
  return data.subscribers?.[0] ?? null;
}

export async function findOrCreateSubscriber(
  email: string,
  firstName?: string
): Promise<KitSubscriber> {
  const existing = await findSubscriberByEmail(email);
  if (existing) return existing;
  const { subscriber } = await createSubscriber(email, firstName);
  return subscriber;
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

  const response = await fetch(`${KIT_API_BASE}/subscribers/${subscriberId}`, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`ConvertKit API error: ${response.status} - ${error}`);
  }

  return response.json();
}

// --- Tag management ---

const tagIdCache = new Map<string, number>();

export async function findTagIdByName(name: string): Promise<number | null> {
  if (tagIdCache.has(name)) return tagIdCache.get(name)!;

  const response = await fetch(`${KIT_API_BASE}/tags`, { headers: headers() });
  if (!response.ok) return null;
  const data = (await response.json()) as { tags?: KitTag[] };
  const tag = data.tags?.find((t) => t.name === name);
  if (tag) {
    tagIdCache.set(name, tag.id);
    return tag.id;
  }
  return null;
}

export async function createTag(name: string): Promise<number | null> {
  const response = await fetch(`${KIT_API_BASE}/tags`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ name }),
  });
  if (!response.ok) return null;
  const data = (await response.json()) as { tag?: KitTag };
  if (data.tag) {
    tagIdCache.set(name, data.tag.id);
    return data.tag.id;
  }
  return null;
}

export async function findOrCreateTagId(name: string): Promise<number> {
  const existing = await findTagIdByName(name);
  if (existing) return existing;
  const created = await createTag(name);
  if (created) return created;
  throw new Error(`Failed to find or create tag: ${name}`);
}

export async function tagSubscriber(
  subscriberId: number,
  tagId: number
): Promise<void> {
  const response = await fetch(
    `${KIT_API_BASE}/tags/${tagId}/subscribers/${subscriberId}`,
    {
      method: "POST",
      headers: headers(),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`ConvertKit tag error: ${response.status} - ${error}`);
  }
}

export async function tagSubscriberByName(
  subscriberId: number,
  tagName: string
): Promise<void> {
  const tagId = await findOrCreateTagId(tagName);
  await tagSubscriber(subscriberId, tagId);
}

export async function tagSubscriberByNames(
  subscriberId: number,
  tagNames: string[]
): Promise<void> {
  await Promise.all(
    tagNames.map((name) => tagSubscriberByName(subscriberId, name))
  );
}
