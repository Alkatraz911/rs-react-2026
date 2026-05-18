import { useState } from 'react';

import { useSearchParams } from 'react-router-dom';

import { useLocalStorage } from '../../hooks/useLocalStorage';

function Search() {
  const [searchParams, setSearchParams] =
    useSearchParams();

  const query =
    searchParams.get('query') || '';

  const [savedSearch, setSavedSearch] =
    useLocalStorage(
      'search',
      query
    );

  const [value, setValue] =
    useState(() => savedSearch);

  const handleSubmit = () => {
    const trimmed = value.trim();

    setSavedSearch(trimmed);

    const params = new URLSearchParams(
      searchParams
    );

    if (trimmed) {
      params.set('query', trimmed);
    } else {
      params.delete('query');
    }

    params.set('page', '1');

    setSearchParams(params);
  };

  const handleClearSearch = () => {
    setValue('');
    setSavedSearch('');
    setSearchParams('');
  };

  return (
    <div className="search">
      <input
        value={value}
        onChange={(e) =>
          setValue(e.target.value)
        }
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSubmit();
          }
        }}
        placeholder="Search pokemon..."
      />

      <button
        className="clear-search"
        onClick={handleClearSearch}
      >
        X
      </button>

      <button onClick={handleSubmit}>
        Search
      </button>
    </div>
  );
}

export default Search;