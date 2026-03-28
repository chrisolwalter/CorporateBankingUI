export function ReadOnlyRow({ label, value, tone = "default" }) {
  return (
    <div className={`readonly-row readonly-row--${tone}`}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
