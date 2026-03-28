export function Header({ portalTitle, currentTime, language, country, countryFlag, languages, countries, onLanguageChange, onCountryChange }) {
  return (
    <header className="portal-header">
      <div className="portal-header__brand">
        <h1>{portalTitle}</h1>
      </div>

      <div className="portal-header__controls">
        <div className="portal-header__time">
          <span>Current Time</span>
          <strong>{currentTime}</strong>
        </div>

        <label className="portal-header__select-wrap">
          <span>Language</span>
          <select value={language} onChange={(event) => onLanguageChange(event.target.value)}>
            {languages.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="portal-header__select-wrap">
          <span>Country</span>
          <div className="portal-header__country-wrap">
            <span className="portal-header__country-flag" aria-hidden="true">{countryFlag}</span>
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
