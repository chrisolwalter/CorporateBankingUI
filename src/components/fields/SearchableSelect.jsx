import { useMemo, useState } from "react";

export function SearchableSelect({
  id,
  label,
  options,
  value,
  onChange,
  placeholder = "Search...",
  required = false,
  noDefault = false
}) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((option) => option.id === value) || null;

  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return options;
    }

    return options.filter((option) => option.label.toLowerCase().includes(normalizedQuery));
  }, [options, query]);

  const inputValue = isOpen ? query : selectedOption?.label || "";

  const handleSelect = (optionId) => {
    onChange(optionId);
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div className="searchable-select" onBlur={() => setTimeout(() => setIsOpen(false), 120)}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={`${id}-options`}
        aria-autocomplete="list"
        value={inputValue}
        placeholder={selectedOption ? selectedOption.label : placeholder}
        onFocus={() => {
          setIsOpen(true);
          setQuery("");
        }}
        onChange={(event) => {
          setQuery(event.target.value);
          setIsOpen(true);
        }}
        autoComplete="off"
        required={required}
      />

      {isOpen ? (
        <ul id={`${id}-options`} className="searchable-select__menu" role="listbox" aria-label={`${label} options`}>
          {filteredOptions.length ? (
            <>
              {noDefault ? (
                <li>
                  <button
                    type="button"
                    className={!value ? "is-active" : ""}
                    onMouseDown={(event) => {
                      event.preventDefault();
                      handleSelect("");
                    }}
                  >
                    — No selection —
                  </button>
                </li>
              ) : null}
              {filteredOptions.map((option) => (
              <li key={option.id}>
                <button
                  type="button"
                  className={option.id === value ? "is-active" : ""}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    handleSelect(option.id);
                  }}
                >
                  {option.label}
                </button>
              </li>
              ))}
            </>
          ) : (
            <li className="searchable-select__empty">No matching accounts</li>
          )}
        </ul>
      ) : null}
    </div>
  );
}
