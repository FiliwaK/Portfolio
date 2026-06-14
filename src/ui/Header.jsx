export default function Header() {
  return (
    <header className="header">
      <div className="logo">F.DEV</div>

      <nav className="nav">
        <span>Univers</span>
        <span>Projets</span>
        <span>Contact</span>
      </nav>

      <a
        className="cta-btn"
        href="https://github.com/FiliwaK"
        target="_blank"
        rel="noreferrer"
      >
        GitHub →
      </a>
    </header>
  )
}