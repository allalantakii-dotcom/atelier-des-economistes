import { AccessToken } from "livekit-server-sdk";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const livekitUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

  if (!apiKey || !apiSecret || !livekitUrl) {
    return Response.json({ error: "LiveKit is not configured yet." }, { status: 503 });
  }

  try {
    const body = await request.json();
    const room = typeof body.room === "string" ? body.room.trim() : "";
    const identity = typeof body.identity === "string" ? body.identity.trim() : "";
    const role = body.role === "teacher" ? "teacher" : "student";

    if (!room || !identity || room.length > 100 || identity.length > 100) {
      return Response.json({ error: "A valid room and identity are required." }, { status: 400 });
    }

    const token = new AccessToken(apiKey, apiSecret, {
      identity,
      name: identity,
      ttl: "2h",
      metadata: JSON.stringify({ role }),
    });

    token.addGrant({
      room,
      roomJoin: true,
      canPublish: true,
      canPublishData: true,
      canSubscribe: true,
    });

    return Response.json({ token: await token.toJwt(), url: livekitUrl });
  } catch {
    return Response.json({ error: "Unable to create a classroom token." }, { status: 400 });
  }
}