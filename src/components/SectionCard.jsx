export function SectionCard({ title, subtitle, children, tone = "default" }) {
  return (
    <section className={`section-card section-card--${tone}`}>
      <header className="section-card__header">
        <h2>{title}</h2>
        {subtitle ? <p>{subtitle}</p> : null}
      </header>
      <div className="section-card__content">{children}</div>
    </section>
  );
}
