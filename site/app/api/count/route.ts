import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const apiKey = process.env.BREVO_API_KEY;
  const listId = process.env.BREVO_LIST_ID;
  if (!apiKey || !listId) {
    return NextResponse.json({ count: 0 }, { status: 200 });
  }

  try {
    const res = await fetch(
      `https://api.brevo.com/v3/contacts/lists/${Number(listId)}`,
      {
        headers: { "api-key": apiKey, accept: "application/json" },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return NextResponse.json({ count: 0 }, { status: 200 });
    }

    const data = (await res.json()) as {
      uniqueSubscribers?: number;
      totalSubscribers?: number;
    };
    const count = data.uniqueSubscribers ?? data.totalSubscribers ?? 0;
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: 0 }, { status: 200 });
  }
}
