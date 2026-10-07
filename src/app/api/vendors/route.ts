import { NextResponse } from "next/server";
import { MOCK_VENDORS } from "@/mocks/prototype-mock";

export function GET() {
  return NextResponse.json({ vendors: MOCK_VENDORS });
}
