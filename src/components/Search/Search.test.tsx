import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import Search from './Search';

describe('Search component', () => {
  test('renders input and button', () => {
    render(
      <Search
        onSearch={vi.fn()}
        defaultValue=""
      />
    );

    expect(
      screen.getByRole('textbox')
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', {
        name: /search/i,
      })
    ).toBeInTheDocument();
  });

  test('renders default value', () => {
    render(
      <Search
        onSearch={vi.fn()}
        defaultValue="Rick"
      />
    );

    expect(
      screen.getByRole('textbox')
    ).toHaveValue('Rick');
  });

  test('updates input value when user types', async () => {
    const user = userEvent.setup();

    render(
      <Search
        onSearch={vi.fn()}
        defaultValue=""
      />
    );

    const input = screen.getByRole('textbox');

    await user.type(input, 'Morty');

    expect(input).toHaveValue('Morty');
  });

  test('calls onSearch with correct value', async () => {
    const user = userEvent.setup();

    const onSearch = vi.fn();

    render(
      <Search
        onSearch={onSearch}
        defaultValue=""
      />
    );

    const input = screen.getByRole('textbox');

    await user.type(input, 'Summer');

    await user.click(
      screen.getByRole('button', {
        name: /search/i,
      })
    );

    expect(onSearch).toHaveBeenCalledTimes(1);

    expect(onSearch).toHaveBeenCalledWith(
      'Summer'
    );
  });

  test('updates input when defaultValue prop changes', () => {
    const { rerender } = render(
      <Search
        onSearch={vi.fn()}
        defaultValue="Rick"
      />
    );

    expect(
      screen.getByRole('textbox')
    ).toHaveValue('Rick');

    rerender(
      <Search
        onSearch={vi.fn()}
        defaultValue="Morty"
      />
    );

    expect(
      screen.getByRole('textbox')
    ).toHaveValue('Morty');
  });

  test('calls onSearch with empty string', async () => {
    const user = userEvent.setup();

    const onSearch = vi.fn();

    render(
      <Search
        onSearch={onSearch}
        defaultValue=""
      />
    );

    await user.click(
      screen.getByRole('button', {
        name: /search/i,
      })
    );

    expect(onSearch).toHaveBeenCalledWith('');
  });
});