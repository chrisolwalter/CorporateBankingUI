import { useRef } from "react";

export function AIAutofillActionCard({ onFilesSelected, title = "AI Powered AutoFill", helperText = "Upload invoice to extract and auto-fill payment details" }) {
  const inputRef = useRef(null);

  return (
    <>
      <button type="button" className="ai-autofill-card" onClick={() => inputRef.current?.click()}>
        <span className="ai-autofill-card__icon" aria-hidden="true">📄</span>
        <span className="ai-autofill-card__content">
          <span className="ai-autofill-card__badge">AI</span>
          <strong>{title}</strong>
          <small>{helperText}</small>
        </span>
        <span className="ai-autofill-card__spark" aria-hidden="true">✦</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        hidden
        onChange={(e) => onFilesSelected(Array.from(e.target.files || []).map((f) => f.name))}
      />
    </>
  );
}
