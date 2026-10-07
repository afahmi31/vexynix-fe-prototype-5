"use client";

/**
 * Vexynix community join card (handoff section 6.1 step 10) — sits between the
 * category feature tiles and New Releases. Marketing chrome, not catalog data.
 */
const SOCIALS = [
  { label: "Discord", icon: "fa-brands fa-discord" },
  { label: "X (Twitter)", icon: "fa-brands fa-x-twitter" },
  { label: "Instagram", icon: "fa-brands fa-instagram" },
  { label: "YouTube", icon: "fa-brands fa-youtube" },
];

export default function CommunityCard() {
  return (
    <section className="vx-community" aria-label="Komunitas Vexynix">
      <div className="vx-community-copy">
        <span className="vx-community-eyebrow">
          <i className="fa-solid fa-user-group" aria-hidden="true" />
          Komunitas Vexynix
        </span>
        <h2>Rakit strategi, rayakan maxwin</h2>
        <p>
          Bagikan momen kemenangan, ikut event eksklusif, dan dapatkan info game
          baru lebih dulu bareng ribuan pemain lain.
        </p>
      </div>

      <div className="vx-community-actions">
        <div className="vx-community-socials" aria-label="Saluran komunitas">
          {SOCIALS.map((social) => (
            <a key={social.label} href="#" className="vx-community-social" aria-label={social.label}>
              <i className={social.icon} aria-hidden="true" />
            </a>
          ))}
        </div>
        <a href="#" className="vx-btn vx-btn--primary">
          <i className="fa-brands fa-discord" aria-hidden="true" />
          Gabung Discord
        </a>
      </div>
    </section>
  );
}
