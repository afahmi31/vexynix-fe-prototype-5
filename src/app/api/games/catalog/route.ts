import { NextResponse } from "next/server";
import { MOCK_CATALOG } from "@/mocks/prototype-mock";

export function GET() {
  return NextResponse.json({ games: MOCK_CATALOG });
}
