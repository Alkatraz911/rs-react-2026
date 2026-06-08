import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CountryAutocomplete from './CountryAutocomplete';

const COUNTRIES = ['Germany', 'Greece', 'Spain', 'Sweden'];

describe('CountryAutocomplete', () => {
  it('renders an input with the combobox role', () => {
    render(
      <CountryAutocomplete
        id="c"
        value=""
        onChange={vi.fn()}
        countries={COUNTRIES}
      />
    );
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('does not show suggestions when value is empty', () => {
    render(
      <CountryAutocomplete
        id="c"
        value=""
        onChange={vi.fn()}
        countries={COUNTRIES}
      />
    );
    const combo = screen.getByRole('combobox');
    fireEvent.focus(combo);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('shows filtered suggestions when value matches', () => {
    render(
      <CountryAutocomplete
        id="c"
        value="ge"
        onChange={vi.fn()}
        countries={COUNTRIES}
      />
    );
    const combo = screen.getByRole('combobox');
    fireEvent.focus(combo);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByText('Germany')).toBeInTheDocument();
  });

  it('filter is case insensitive', () => {
    render(
      <CountryAutocomplete
        id="c"
        value="GER"
        onChange={vi.fn()}
        countries={COUNTRIES}
      />
    );
    fireEvent.focus(screen.getByRole('combobox'));
    expect(screen.getByText('Germany')).toBeInTheDocument();
  });

  it('calls onChange when typing', async () => {
    const onChange = vi.fn();
    render(
      <CountryAutocomplete
        id="c"
        value=""
        onChange={onChange}
        countries={COUNTRIES}
      />
    );
    await userEvent.type(screen.getByRole('combobox'), 'g');
    expect(onChange).toHaveBeenCalledWith('g');
  });

  it('calls onChange with the picked country when a suggestion is clicked', () => {
    const onChange = vi.fn();
    render(
      <CountryAutocomplete
        id="c"
        value="ge"
        onChange={onChange}
        countries={COUNTRIES}
      />
    );
    fireEvent.focus(screen.getByRole('combobox'));
    fireEvent.mouseDown(screen.getByText('Germany'));
    expect(onChange).toHaveBeenCalledWith('Germany');
  });

  it('exposes aria attributes for the combobox', () => {
    render(
      <CountryAutocomplete
        id="c"
        value=""
        onChange={vi.fn()}
        countries={COUNTRIES}
      />
    );
    const combo = screen.getByRole('combobox');
    expect(combo).toHaveAttribute('aria-autocomplete', 'list');
    expect(combo).toHaveAttribute('aria-expanded', 'false');
  });
});
