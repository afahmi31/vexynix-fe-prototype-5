"use client";

/**
 * Vexynix global header (handoff section 5.1): logo, primary nav, global
 * search, Log In / Sign Up. Auth actions reuse the portal auth-modal store so
 * the same login/register modals serve every public surface.
 */
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useAuthModalStore } from "@/stores/auth-modal";
import { useSessionStore } from "@/stores/session";
import { useVexynixShell } from "@/stores/vexynix-shell";

const NAV_ITEMS = [
  { label: "Casino", href: "/lobby", active: true },
  { label: "Sports", href: "/games", active: false },
  { label: "Promosi", href: "/games", active: false },
  { label: "VIP", href: "/games", active: false },
  { label: "Turnamen", href: "/games", active: false },
  { label: "Komunitas", href: "/games", active: false },
];

export default function VexynixHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const openLogin = useAuthModalStore((s) => s.openLogin);
  const openRegister = useAuthModalStore((s) => s.openRegister);
  const isLoggedIn = useSessionStore((s) => !!s.token);
  const username = useSessionStore((s) => s.username);
  const toggleRail = useVexynixShell((s) => s.toggleRail);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onShortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onShortcut);
    return () => window.removeEventListener("keydown", onShortcut);
  }, []);

  const navigateSearch = (value: string) => {
    const trimmed = value.trim();
    router.push(trimmed ? `/games?q=${encodeURIComponent(trimmed)}` : "/games");
  };

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = new FormData(event.currentTarget).get("q");
    navigateSearch(typeof value === "string" ? value : query);
  };

  return (
    <header className="vx-header">
      <div className="vx-header-inner">
        <button
          type="button"
          className="vx-icon-btn"
          aria-label="Buka menu navigasi"
          onClick={toggleRail}
        >
          <i className="fa-solid fa-bars-staggered" aria-hidden="true" />
        </button>

        <Link href="/lobby" className="vx-logo" aria-label="Vexynix — beranda">
          <i className="fa-solid fa-crown" aria-hidden="true" />
          <span>Vexynix</span>
        </Link>

        <nav className="vx-header-nav" aria-label="Navigasi utama">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={
                item.active && (pathname === "/lobby" || pathname.startsWith("/games"))
                  ? "is-active"
                  : undefined
              }
            >
              {item.label}
            </a>
          ))}
        </nav>

        <form className="vx-header-search" role="search" onSubmit={submitSearch}>
          <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
          <input
            ref={searchRef}
            type="search"
            name="q"
            placeholder="Cari game, provider, atau kategori…"
            aria-label="Cari game"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                navigateSearch(event.currentTarget.value);
              }
            }}
          />
          <kbd>Ctrl K</kbd>
        </form>

        <button
          type="button"
          className="vx-header-search-trigger vx-icon-btn"
          aria-label="Cari game"
          onClick={() => router.push("/games")}
        >
          <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
        </button>

        <div className="vx-header-actions">
          {isLoggedIn ? (
            <>
              <Link href="/wallet/deposit" className="vx-btn vx-btn--primary">
                <i className="fa-solid fa-bolt" aria-hidden="true" />
                Deposit
              </Link>
              <Link href="/account" className="vx-btn vx-btn--ghost">
                <i className="fa-solid fa-user" aria-hidden="true" />
                {username || "Akun"}
              </Link>
            </>
          ) : (
            <>
              <button type="button" className="vx-btn vx-btn--ghost" onClick={() => openLogin()}>
                Masuk
              </button>
              <button
                type="button"
                className="vx-btn vx-btn--primary"
                onClick={() => openRegister()}
              >
                Daftar
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
