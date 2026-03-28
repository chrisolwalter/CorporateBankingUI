export function KeyValueList({ items }) {
  return (
    <dl className="key-value-list">
      {items.map((item) => (
        <div className="key-value-list__row" key={item.label}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
