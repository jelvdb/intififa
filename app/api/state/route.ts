import { NextResponse } from "next/server";
import { readState } from "@/lib/storage";

export function GET() {
  const state = readState();
  return NextResponse.json(state);
}
