export function PortalCard({ title, subtitle, children, variant = "default" }) {
  return (
    <section className={`portal-card portal-card--${variant}`}>
      <header className="portal-card__header">
        <h2>{title}</h2>
        {subtitle ? <p>{subtitle}</p> : null}
      </header>
      <div className="portal-card__body">{children}</div>
    </section>
  );
}
