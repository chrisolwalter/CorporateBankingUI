export function Header({
  portalTitle,
  currentTime,
  language,
  country,
  countryFlag,
  languages,
  countries,
  onLanguageChange,
  onCountryChange,
  labels
}) {
  return (
    <header className="portal-header">
      <div className="portal-header__brand">
        <h1>{portalTitle}</h1>
      </div>

      <div className="portal-header__controls">
        <div className="portal-header__time">
          <span>{labels.currentTime}</span>
          <strong>{currentTime}</strong>
        </div>

        <label className="portal-header__select-wrap">
          <span>{labels.language}</span>
          <select value={language} onChange={(event) => onLanguageChange(event.target.value)}>
            {languages.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="portal-header__select-wrap">
          <span>{labels.country}</span>
          <div className="portal-header__country-wrap">
            <span className="portal-header__country-flag" aria-hidden="true">
              <img src={countryFlag} alt="" />
            </span>
            <select value={country} onChange={(event) => onCountryChange(event.target.value)}>
              {countries.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </label>
      </div>
    </header>
  );
}
