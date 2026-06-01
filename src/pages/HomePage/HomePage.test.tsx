import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, beforeEach } from 'vitest';

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

const mockRefetch = vi.fn();

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
            refetch: mockRefetch,
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
            refetch: mockRefetch,
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
            refetch: mockRefetch,
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
            refetch: mockRefetch,
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
            refetch: mockRefetch,
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
            refetch: mockRefetch,
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
            refetch: mockRefetch,
        });
        renderWithRouter(<HomePage />);
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    test('renders right panel when details route active', () => {
        renderWithRouter(<HomePage />, '/pokemon/1');
        expect(document.querySelector('.right-panel')).toBeInTheDocument();
    });

    test('renders error container with try again button', () => {
        mockedUsePokemonList.mockReturnValue({
            items: [],
            loading: false,
            error: 'Network error',
            totalPages: 1,
            refetch: mockRefetch,
        });
        const { container } = renderWithRouter(<HomePage />);
        expect(container.querySelector('.error-container')).toBeInTheDocument();
        expect(screen.getByText('Try Again')).toBeInTheDocument();
    });

    test('try again button calls refetch', async () => {
        const user = userEvent.setup();
        mockedUsePokemonList.mockReturnValue({
            items: [],
            loading: false,
            error: 'Network error',
            totalPages: 1,
            refetch: mockRefetch,
        });
        renderWithRouter(<HomePage />);
        const tryAgainBtn = screen.getByText('Try Again');
        await user.click(tryAgainBtn);
        expect(mockRefetch).toHaveBeenCalled();
    });

    test('refresh button is shown when data is loaded', () => {
        mockedUsePokemonList.mockReturnValue({
            items: [
                {
                    id: 1,
                    name: 'bulbasaur',
                    image: null,
                    height: 7,
                    types: ['grass'],
                },
            ],
            loading: false,
            error: null,
            totalPages: 1,
            refetch: mockRefetch,
        });
        renderWithRouter(<HomePage />);
        expect(screen.getByText('Refresh')).toBeInTheDocument();
    });

    test('refresh button calls refetch', async () => {
        const user = userEvent.setup();
        mockedUsePokemonList.mockReturnValue({
            items: [
                {
                    id: 1,
                    name: 'bulbasaur',
                    image: null,
                    height: 7,
                    types: ['grass'],
                },
            ],
            loading: false,
            error: null,
            totalPages: 1,
            refetch: mockRefetch,
        });
        renderWithRouter(<HomePage />);
        const refreshBtn = screen.getByText('Refresh');
        await user.click(refreshBtn);
        expect(mockRefetch).toHaveBeenCalled();
    });

    test('handles search query from search params', () => {
        mockedUsePokemonList.mockReturnValue({
            items: [],
            loading: false,
            error: null,
            totalPages: 1,
            refetch: mockRefetch,
        });
        renderWithRouter(<HomePage />, '/?query=pikachu&page=1');
        expect(mockedUsePokemonList).toHaveBeenCalledWith('pikachu', 1);
    });

    test('handles page number from search params', () => {
        mockedUsePokemonList.mockReturnValue({
            items: [],
            loading: false,
            error: null,
            totalPages: 1,
            refetch: mockRefetch,
        });
        renderWithRouter(<HomePage />, '/?page=2');
        expect(mockedUsePokemonList).toHaveBeenCalledWith('', 2);
    });

    test('does not render pagination when loading', () => {
        mockedUsePokemonList.mockReturnValue({
            items: [],
            loading: true,
            error: null,
            totalPages: 5,
            refetch: mockRefetch,
        });
        const { container } = renderWithRouter(<HomePage />);
        expect(container.querySelector('.pagination')).not.toBeInTheDocument();
    });

    test('does not render pagination when error', () => {
        mockedUsePokemonList.mockReturnValue({
            items: [],
            loading: false,
            error: 'Error',
            totalPages: 5,
            refetch: mockRefetch,
        });
        const { container } = renderWithRouter(<HomePage />);
        expect(container.querySelector('.pagination')).not.toBeInTheDocument();
    });

    test('renders with details layout when on pokemon route', () => {
        mockedUsePokemonList.mockReturnValue({
            items: [],
            loading: false,
            error: null,
            totalPages: 1,
            refetch: mockRefetch,
        });
        const { container } = renderWithRouter(<HomePage />, '/pokemon/1');
        expect(container.querySelector('.with-details')).toBeInTheDocument();
    });
});