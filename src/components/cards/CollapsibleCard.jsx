import { useState } from "react";

export function CollapsibleCard({ title, defaultExpanded = true, children, variant = "default" }) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <section className={`collapsible-card collapsible-card--${variant} ${expanded ? "is-expanded" : ""}`}>
      <button type="button" className="collapsible-card__header" onClick={() => setExpanded((v) => !v)} aria-expanded={expanded}>
        <span>{title}</span>
        <span className={`collapsible-card__chevron ${expanded ? "is-open" : ""}`} aria-hidden="true">⌄</span>
      </button>
      {expanded ? <div className="collapsible-card__body">{children}</div> : null}
    </section>
  );
}
