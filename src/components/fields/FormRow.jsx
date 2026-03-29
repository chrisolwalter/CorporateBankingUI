export function FormRow({ id, label, children, required = false }) {
  return (
    <div className={`form-row ${required ? "form-row--required" : ""}`}>
      <label htmlFor={id}>
        {label}
        {required ? <span className="required-indicator" aria-hidden="true"> *</span> : null}
      </label>
      {children}
    </div>
  );
}
