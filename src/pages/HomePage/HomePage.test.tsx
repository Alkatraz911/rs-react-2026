import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import HomePage from './HomePage';
import { renderWithRouter } from '../../helpers/test.utils';
import { usePokemonList } from '../../hooks/usePokemonList';
import { useLocation } from 'react-router-dom';

function LocationDisplay() {
    const location = useLocation();

    return (
        <div data-testid="location">
            {location.search}
        </div>
    );
}

vi.mock('../../hooks/usePokemonList', () => ({
    usePokemonList: vi.fn(),
}));

const mockedUsePokemonList = vi.mocked(usePokemonList);

describe('HomePage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('renders loader', () => {
        mockedUsePokemonList.mockReturnValue({
            items: [],
            loading: true,
            error: null,
            totalPages: 1,
        });

        renderWithRouter(<HomePage />);

        expect(screen.getByTestId('loader')).toBeInTheDocument();
    });

    test('renders error message', () => {
        mockedUsePokemonList.mockReturnValue({
            items: [],
            loading: false,
            error: 'Failed to load',
            totalPages: 1,
        });

        renderWithRouter(<HomePage />);

        expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
    });

    test('renders pokemon list', () => {
        mockedUsePokemonList.mockReturnValue({
            items: [
                {
                    id: 1,
                    name: 'pikachu',
                    image: null,
                    height: 4,
                    types: [],
                },
            ],
            loading: false,
            error: null,
            totalPages: 1,
        });

        renderWithRouter(<HomePage />);

        expect(screen.getByText('pikachu')).toBeInTheDocument();
    });

    test('renders pagination when data loaded', () => {
        mockedUsePokemonList.mockReturnValue({
            items: [
                {
                    id: 1,
                    name: 'pikachu',
                    image: null,
                    height: 4,
                    types: [],
                },
            ],
            loading: false,
            error: null,
            totalPages: 5,
        });

        renderWithRouter(<HomePage />);

        expect(screen.getByText('1')).toBeInTheDocument();
    });

    test('updates page in search params', async () => {
        const user = userEvent.setup();

        mockedUsePokemonList.mockReturnValue({
            items: [
                {
                    id: 1,
                    name: 'pikachu',
                    image: null,
                    height: 4,
                    types: [],
                },
            ],
            loading: false,
            error: null,
            totalPages: 5,
        });

        renderWithRouter(
            <>
                <HomePage />
                <LocationDisplay />
            </>
        );

        const page2 = screen.getByRole('button', { name: '2' });

        await user.click(page2);

        expect(screen.getByTestId('location')).toHaveTextContent('page=2');
    });

    test('renders layout classes without details route', () => {
        mockedUsePokemonList.mockReturnValue({
            items: [],
            loading: false,
            error: null,
            totalPages: 1,
        });

        const { container } = renderWithRouter(<HomePage />, '/');

        expect(container.querySelector('.app-layout')).toBeInTheDocument();
    });

    test('renders search component', () => {
        mockedUsePokemonList.mockReturnValue({
            items: [],
            loading: false,
            error: null,
            totalPages: 1,
        });

        renderWithRouter(<HomePage />);

        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    test('renders right panel when details route active', () => {
        renderWithRouter(<HomePage />, '/pokemon/1');

        expect(document.querySelector('.right-panel')).toBeInTheDocument();
    });
});