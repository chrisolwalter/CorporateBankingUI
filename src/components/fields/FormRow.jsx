export function FormRow({ id, label, children }) {
  return (
    <div className="form-row">
      <label htmlFor={id}>{label}</label>
      {children}
    </div>
  );
}
