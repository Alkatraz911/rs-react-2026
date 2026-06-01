import {  screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach } from 'vitest';
import Search from './Search';
import { renderWithRouter } from '../../helpers/test.utils';
import {
  useLocation,
} from 'react-router-dom';

function LocationDisplay() {
  const location = useLocation();

  return (
    <div data-testid="location">
      {location.search}
    </div>
  );
}
describe('Search component', () => {
  beforeEach(() => {
    localStorage.clear();
  });


test('clears query param when search is empty', async () => {
  const user = userEvent.setup();

  renderWithRouter(
    <>
      <Search />
      <LocationDisplay />
    </>
  );

  await user.click(
    screen.getByRole('button', {
      name: /search/i,
    })
  );

  expect(
    screen.getByTestId('location')
  ).not.toHaveTextContent('query=');

  expect(
    screen.getByTestId('location')
  ).toHaveTextContent('?page=1');
});



test('sets page=1 when search is empty', async () => {
  const user = userEvent.setup();

  renderWithRouter(
    <>
      <Search />
      <LocationDisplay />
    </>
  );

  await user.click(
    screen.getByRole('button', {
      name: /search/i,
    })
  );

  expect(
    screen.getByTestId('location')
  ).toHaveTextContent('?page=1');
});


test('sets query param after search', async () => {
  const user = userEvent.setup();

  renderWithRouter(
    <>
      <Search />
      <LocationDisplay />
    </>
  );

  const input = screen.getByRole('textbox');

  await user.type(input, 'Pikachu');

  await user.click(
    screen.getByRole('button', {
      name: /search/i,
    })
  );

  expect(
    screen.getByTestId('location')
  ).toHaveTextContent(
    '?query=Pikachu&page=1'
  );
});

test('renders input field', () => {
  renderWithRouter(<Search />);
  const input = screen.getByRole('textbox');
  expect(input).toBeInTheDocument();
  expect(input).toHaveAttribute('placeholder', 'Search pokemon...');
});

test('renders input field', () => {
  renderWithRouter(<Search />);
  const input = screen.getByRole('textbox');
  expect(input).toBeInTheDocument();
  expect(input).toHaveAttribute('placeholder', 'Search pokemon...');
});

test('renders search and clear buttons', () => {
  renderWithRouter(<Search />);
  expect(
    screen.getByRole('button', { name: /search/i })
  ).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'X' })).toBeInTheDocument();
});

test('updates input value on type', async () => {
  const user = userEvent.setup();
  renderWithRouter(<Search />);

  const input = screen.getByRole('textbox') as HTMLInputElement;
  await user.clear(input);
  await user.type(input, 'charmander');

  expect(input.value).toContain('charmander');
});

test('submits search on Enter key', async () => {
  const user = userEvent.setup();

  renderWithRouter(
    <>
      <Search />
      <LocationDisplay />
    </>
  );

  const input = screen.getByRole('textbox') as HTMLInputElement;
  await user.clear(input);
  await user.type(input, 'squirtle{Enter}');

  expect(
    screen.getByTestId('location')
  ).toHaveTextContent('query=squirtle');
});

test('clears search when clear button clicked', async () => {
  const user = userEvent.setup();

  renderWithRouter(
    <>
      <Search />
      <LocationDisplay />
    </>
  );

  const input = screen.getByRole('textbox') as HTMLInputElement;
  const clearBtn = screen.getByRole('button', { name: 'X' });

  await user.clear(input);
  await user.type(input, 'bulbasaur');
  expect(input.value).toContain('bulbasaur');

  await user.click(clearBtn);
  expect(input.value).toBe('');
});

});