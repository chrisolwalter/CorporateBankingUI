export function PortalCard({ title, subtitle, children }) {
  return (
    <section className="portal-card">
      <header className="portal-card__header">
        <h2>{title}</h2>
        {subtitle ? <p>{subtitle}</p> : null}
      </header>
      <div className="portal-card__body">{children}</div>
    </section>
  );
}
