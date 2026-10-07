"use client";

/**
 * Vexynix lobby page (handoff section 6.1): left rail + center content +
 * contextual right rail, assembled in the reference's vertical order.
 */
import LeftNavRail from "./LeftNavRail";
import HeroBanner from "./HeroBanner";
import LiveWinsRail from "./LiveWinsRail";
import PromoTiles from "./PromoTiles";
import SearchChipsBar from "./SearchChipsBar";
import GameSection from "./GameSection";
import Top10Panel from "./Top10Panel";
import CategoryTiles from "./CategoryTiles";
import CommunityCard from "./CommunityCard";
import ProviderTiles from "./ProviderTiles";
import { popularGames, newReleases } from "./data";

export default function VexynixLobbyPage() {
  return (
    <div className="vx-body">
      <LeftNavRail />

      <div className="vx-content">
        {/* Hero + live wins rail */}
        <div className="vx-hero-row">
          <HeroBanner />
          <LiveWinsRail />
        </div>

        {/* Promo / reward tiles */}
        <PromoTiles />

        {/* Search + quick category chips */}
        <SearchChipsBar />

        {/* Popular grid + Top 10 right rail */}
        <div className="vx-duo">
          <GameSection
            title="Populer Saat Ini"
            icon="fa-solid fa-fire"
            seeAllHref="/games?sort=popular"
            games={popularGames(8)}
          />
          <div className="vx-duo-rail">
            <Top10Panel />
          </div>
        </div>

        {/* Category feature tiles */}
        <CategoryTiles />

        {/* Join / community card (section 6.1 step 10) */}
        <CommunityCard />

        {/* New releases + top providers */}
        <div className="vx-duo">
          <GameSection
            title="Rilis Baru"
            icon="fa-solid fa-wand-magic-sparkles"
            seeAllLabel="Lihat Semua"
            seeAllHref="/games?sort=new"
            games={newReleases(8)}
          />
          <div className="vx-duo-rail">
            <ProviderTiles />
          </div>
        </div>
      </div>
    </div>
  );
}
