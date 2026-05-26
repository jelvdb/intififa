import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const AUTH_FILE = path.join(process.cwd(), "auth.json");

function storedCredential(): string | null {
  // Env var takes precedence (permanent on Vercel)
  if (process.env.ALLOWED_CREDENTIAL_ID) return process.env.ALLOWED_CREDENTIAL_ID;
  if (!fs.existsSync(AUTH_FILE)) return null;
  try {
    return JSON.parse(fs.readFileSync(AUTH_FILE, "utf-8")).credentialId ?? null;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  if (storedCredential()) {
    return NextResponse.json({ error: "Already registered" }, { status: 403 });
  }

  const { credentialId } = await req.json();
  if (!credentialId || typeof credentialId !== "string") {
    return NextResponse.json({ error: "Invalid" }, { status: 400 });
  }

  try {
    fs.writeFileSync(AUTH_FILE, JSON.stringify({ credentialId }));
  } catch {
    // Read-only filesystem (Vercel) — credential only lives until cold start
  }

  // Return the credential ID so the user can set it as ALLOWED_CREDENTIAL_ID env var
  return NextResponse.json({ ok: true, credentialId });
}
