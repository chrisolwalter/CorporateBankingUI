export function ConfirmationSummarySection({ title, rows }) {
  return (
    <section className="confirmation-summary">
      <h3>{title}</h3>
      <div className="confirmation-summary-grid">
        {rows.map((row) => (
          <div className="confirmation-summary-grid__row" key={`${row.left.label}-${row.right.label}`}>
            <div className="confirmation-summary-grid__cell">
              <dt>{row.left.label}</dt>
              <dd>{row.left.value}</dd>
            </div>
            <div className="confirmation-summary-grid__cell">
              <dt>{row.right.label}</dt>
              <dd>{row.right.value}</dd>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
