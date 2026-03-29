export function Timeline({ title, steps, t }) {
  return (
    <section className="timeline-card">
      <h3>{title}</h3>
      <ul className="timeline">
        {steps.map((step) => (
          <li key={step.label} className={`timeline__item timeline__item--${step.state}`}>
            <span className="timeline__dot" aria-hidden="true" />
            <div>
              <strong>{step.label}</strong>
              <p>{step.state === "done" ? t("completed") : step.state === "current" ? t("in_progress") : t("pending")}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ReviewList({ title, items }) {
  return (
    <section className="review-group">
      <h3>{title}</h3>
      <dl className="readonly-list">
        {items.map((item) => (
          <div className="readonly-row" key={item.label}>
            <dt>{item.label}</dt>
            <dd>{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
