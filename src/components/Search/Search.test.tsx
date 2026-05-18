import {  screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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



});