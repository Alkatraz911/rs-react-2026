import { useId, useState } from 'react';

interface Props {
  id: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  countries: string[];
  placeholder?: string;
}

const MAX_SUGGESTIONS = 8;

function CountryAutocomplete({
  id,
  name,
  value,
  onChange,
  countries,
  placeholder,
}: Props) {
  const [focused, setFocused] = useState(false);
  const listboxId = useId();

  const suggestions = value.trim().length === 0
    ? []
    : countries
        .filter((country) =>
          country.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, MAX_SUGGESTIONS);

  const showSuggestions = focused && suggestions.length > 0;

  return (
    <div className="country-autocomplete">
      <input
        id={id}
        name={name}
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setTimeout(() => setFocused(false), 100);
        }}
        autoComplete="off"
        role="combobox"
        aria-expanded={showSuggestions}
        aria-autocomplete="list"
        aria-controls={listboxId}
        placeholder={placeholder}
      />

      {showSuggestions && (
        <ul
          id={listboxId}
          className="country-autocomplete__list"
          role="listbox"
        >
          {suggestions.map((country) => (
            <li
              key={country}
              role="option"
              aria-selected={country === value}
              className="country-autocomplete__item"
              onMouseDown={(event) => {
                event.preventDefault();
                onChange(country);
                setFocused(false);
              }}
            >
              {country}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CountryAutocomplete;
