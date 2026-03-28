import { StatusPill } from "./StatusPill";

export function ValidationList({ checks }) {
  return (
    <ul className="validation-list">
      {checks.map((check) => (
        <li key={check.id}>
          <span>{check.label}</span>
          <StatusPill status={check.state} />
        </li>
      ))}
    </ul>
  );
}
