"use client";

import { Suspense } from "react";
import GamePlayPage from "@/components/vexynix/GamePlayPage";

export default function PlayPage() {
  return (
    <Suspense fallback={null}>
      <GamePlayPage />
    </Suspense>
  );
}
