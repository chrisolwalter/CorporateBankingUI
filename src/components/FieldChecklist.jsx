import { StatusPill } from "./StatusPill";

export function FieldChecklist({ fields }) {
  return (
    <ul className="field-checklist" aria-label="transfer fields checklist">
      {fields.map((field) => (
        <li key={field.id} className="field-checklist__item">
          <div>
            <p className="field-checklist__label">{field.label}</p>
            <p className="field-checklist__value">{field.value}</p>
          </div>
          <StatusPill status={field.status} />
        </li>
      ))}
    </ul>
  );
}
