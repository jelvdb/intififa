import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redisUrl = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

export async function GET() {
  const info: Record<string, unknown> = {
    hasUrl: Boolean(redisUrl),
    hasToken: Boolean(redisToken),
    urlPrefix: redisUrl ? redisUrl.slice(0, 30) + "..." : null,
  };

  if (!redisUrl || !redisToken) {
    return NextResponse.json({ ...info, error: "Missing Redis credentials" }, { status: 500 });
  }

  try {
    const redis = new Redis({ url: redisUrl, token: redisToken });
    await redis.set("paninti:debug-test", { ts: Date.now(), test: true });
    const val = await redis.get("paninti:debug-test");
    await redis.del("paninti:debug-test");
    return NextResponse.json({ ...info, ok: true, roundtrip: val });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : undefined;
    return NextResponse.json({ ...info, error: message, stack }, { status: 500 });
  }
}
