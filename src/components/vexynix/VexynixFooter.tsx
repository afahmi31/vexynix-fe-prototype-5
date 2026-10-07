/**
 * Vexynix footer (handoff section 5.2): brand, link groups, language selector,
 * responsible gaming marks, payment marks, legal row.
 */
const PRODUCT_LINKS = ["Casino", "Sports", "Promosi", "VIP", "Turnamen"];
const SUPPORT_LINKS = [
  "Pusat Bantuan",
  "Bermain Bertanggung Jawab",
  "Fair Play",
  "Syarat & Ketentuan",
  "Kebijakan Privasi",
];
const COMMUNITY_LINKS = ["Blog", "Discord", "X (Twitter)", "Instagram", "YouTube"];
const PAY_MARKS = ["VISA", "MASTERCARD", "BITCOIN", "ETHEREUM", "TETHER"];
const SOCIALS = [
  { label: "Discord", icon: "fa-brands fa-discord" },
  { label: "Telegram", icon: "fa-brands fa-telegram" },
  { label: "X", icon: "fa-brands fa-x-twitter" },
  { label: "Instagram", icon: "fa-brands fa-instagram" },
  { label: "YouTube", icon: "fa-brands fa-youtube" },
];

export default function VexynixFooter() {
  return (
    <footer className="vx-footer">
      <div className="vx-footer-inner">
        <div className="vx-footer-top">
          <div className="vx-footer-brand">
            <div className="vx-logo">
              <i className="fa-solid fa-crown" aria-hidden="true" />
              <span>Vexynix</span>
            </div>
            <p>Play Bigger. Brighter. Together. — tempat terbaik untuk bermain dan menang.</p>
            <div className="vx-footer-socials" aria-label="Saluran komunitas">
              {SOCIALS.map((social) => (
                <a key={social.label} href="#" aria-label={social.label}>
                  <i className={social.icon} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <nav className="vx-footer-col" aria-label="Produk">
            <h4>Produk</h4>
            <ul>
              {PRODUCT_LINKS.map((label) => (
                <li key={label}>
                  <a href="#">{label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="vx-footer-col" aria-label="Bantuan">
            <h4>Bantuan</h4>
            <ul>
              {SUPPORT_LINKS.map((label) => (
                <li key={label}>
                  <a href="#">{label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="vx-footer-col" aria-label="Komunitas">
            <h4>Komunitas</h4>
            <ul>
              {COMMUNITY_LINKS.map((label) => (
                <li key={label}>
                  <a href="#">{label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="vx-footer-aside">
            <button type="button" className="vx-lang">
              <i className="fa-solid fa-globe" aria-hidden="true" />
              Bahasa Indonesia
              <i className="fa-solid fa-chevron-down" aria-hidden="true" />
            </button>
            <div className="vx-trust">
              <span className="vx-18" aria-label="18 tahun ke atas">
                18+
              </span>
              <span>Main Secara Bertanggung Jawab</span>
            </div>
            <div className="vx-pays" aria-label="Metode pembayaran">
              {PAY_MARKS.map((mark) => (
                <span key={mark} className="vx-pay-mark">
                  {mark}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="vx-footer-bottom">
          <span>© 2026 Vexynix. All rights reserved.</span>
          <span>Good Games. Brighter Days. ✨</span>
        </div>
      </div>
    </footer>
  );
}
