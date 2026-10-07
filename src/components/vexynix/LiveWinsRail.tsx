"use client";

/**
 * Vexynix live wins rail (handoff section 6.1 step 4). Every row references a
 * real catalog game (section 15.1).
 */
import { MOCK_CATALOG } from "@/mocks/prototype-mock";
import { LIVE_WINS, formatRupiah } from "./data";

function gameName(id: string): string {
  return MOCK_CATALOG.find((g) => g.id === id)?.name ?? id;
}

export default function LiveWinsRail() {
  return (
    <section className="vx-live" aria-label="Kemenangan live">
      <div className="vx-live-head">
        <h3>Kemenangan Live, Pemain Nyata</h3>
        <span className="vx-live-pill">Aktivitas Live</span>
      </div>
      {LIVE_WINS.map((row) => (
        <div className="vx-live-row" key={row.player}>
          <span className="vx-live-avatar" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={MOCK_CATALOG.find((game) => game.id === row.gameId)?.image_url ?? ""}
              alt=""
            />
          </span>
          <div className="vx-live-meta">
            <strong>{row.player}</strong>
            <span>
              Menang <b>{formatRupiah(row.amount)}</b> · {gameName(row.gameId)}
            </span>
          </div>
          <span className="vx-live-time">{row.minutesAgo} mnt lalu</span>
        </div>
      ))}
    </section>
  );
}
