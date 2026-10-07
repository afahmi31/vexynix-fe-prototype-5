"use client";

import { Suspense } from "react";
import GameCatalogPage from "@/components/vexynix/GameCatalogPage";

export default function GamesPage() {
  return (
    <Suspense fallback={null}>
      <GameCatalogPage />
    </Suspense>
  );
}
