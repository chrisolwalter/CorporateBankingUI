import { ReadOnlyRow } from "../fields/ReadOnlyRow";

export function DerivedSection({ title, rows }) {
  return (
    <section className="derived-section" aria-label={title}>
      <h3>{title}</h3>
      <dl className="readonly-list">
        {rows.map((row) => (
          <ReadOnlyRow key={row.label} label={row.label} value={row.value} tone={row.tone} />
        ))}
      </dl>
    </section>
  );
}
