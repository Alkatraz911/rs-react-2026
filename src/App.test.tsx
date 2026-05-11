import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import { fetchPokemons, searchPokemons } from './services/api';
import { act, waitFor } from '@testing-library/react';


vi.mock('./services/api', () => ({
    fetchPokemons: vi.fn(),
    searchPokemons: vi.fn(),
}));

const mockedFetch = vi.mocked(fetchPokemons);
const mockedSearch = vi.mocked(searchPokemons);

describe('App component', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    test('loads initial data (fetchPokemons)', async () => {
        mockedFetch.mockResolvedValue({
            items: [
                {
                    id: 1,
                    name: 'pikachu',
                    image: null,
                    height: 4,
                    types: [],
                },
            ],
            next: null,
            previous: null,
        });

        render(<App />);

        expect(mockedFetch).toHaveBeenCalled();
    });

    test('loads search data if query exists in localStorage', async () => {
        localStorage.setItem('search', 'pikachu');

        mockedSearch.mockResolvedValue({
            items: [
                {
                    id: 1,
                    name: 'pikachu',
                    image: null,
                    height: 4,
                    types: [],
                },
            ],
            next: null,
            previous: null,
        });

        render(<App />);

        expect(mockedSearch).toHaveBeenCalledWith(
            'pikachu'
        );
    });

    test('handles search input + saves to localStorage', async () => {
        const user = userEvent.setup();

        mockedSearch.mockResolvedValue({
            items: [],
            next: null,
            previous: null,
        });

        render(<App />);

        const input = screen.getByRole('textbox');

        await user.type(input, 'pikachu');

        await user.click(
            screen.getByRole('button', {
                name: /search/i,
            })
        );

        expect(
            localStorage.getItem('search')
        ).toBe('pikachu');
    });

    test('renders loader correctly (FIXED)', () => {
        mockedFetch.mockResolvedValue({
            items: [],
            next: null,
            previous: null,
        });

        const { container } = render(<App />);

        expect(
            container.querySelector('.loader')
        ).toBeInTheDocument();
    });

    test('renders error message on API failure', async () => {
        mockedFetch.mockRejectedValue(
            new Error('API error')
        );

        render(<App />);

        expect(
            await screen.findByText(
                /failed to load data/i
            )
        ).toBeInTheDocument();
    });

    test('renders pokemon list', async () => {
        mockedFetch.mockResolvedValue({
            items: [
                {
                    id: 1,
                    name: 'pikachu',
                    image: null,
                    height: 4,
                    types: [],
                },
            ],
            next: null,
            previous: null,
        });

        render(<App />);

        expect(
            await screen.findByText('pikachu')
        ).toBeInTheDocument();
    });
    ;


    test('shows fallback UI when error is triggered', async () => {
        const user = userEvent.setup();

        const consoleSpy = vi
            .spyOn(console, 'error')
            .mockImplementation(() => { });

        render(
            <ErrorBoundary>
                <App />
            </ErrorBoundary>
        );

        const btn = screen.getByRole('button', {
            name: /test error/i,
        });

        await act(async () => {
            await user.click(btn);
        });


        expect(
            await screen.findByText(
                /something went wrong/i
            )
        ).toBeInTheDocument();

        consoleSpy.mockRestore();
    });


    test('pagination buttons exist', async () => {
        mockedFetch.mockResolvedValue({
            items: Array.from({ length: 3 }).map(
                (_, i) => ({
                    id: i,
                    name: `poke-${i}`,
                    image: null,
                    height: 1,
                    types: [],
                })
            ),
            next: 'next',
            previous: null,
        });

        render(<App />);

        expect(
            await screen.findByText('Prev')
        ).toBeInTheDocument();

        expect(
            screen.getByText('Next')
        ).toBeInTheDocument();
    });

    test('calls handlePageChange and updates offset', async () => {
        const user = userEvent.setup();

        mockedFetch.mockResolvedValue({
            items: Array.from({ length: 5 }, (_, i) => ({
                id: i + 1,
                name: `pokemon-${i}`,
                image: null,
                height: 5,
                types: [],
            })),
            next: 'next-url',
            previous: null,
        });

        render(<App />);

        const nextBtn = await screen.findByRole('button', { name: /next/i });
        await user.click(nextBtn);

        expect(mockedFetch).toHaveBeenCalledWith(expect.any(Number));
    });

    test('shows empty state when no items', async () => {

        mockedSearch.mockResolvedValue({ items: [], next: null, previous: null });

        render(<App />);

        const input = screen.getByRole('textbox');
        await userEvent.type(input, 'unknownpokemon123');
        await userEvent.click(screen.getByRole('button', { name: /search/i }));

        expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
        expect(document.querySelector('.results-grid')).toBeEmptyDOMElement();
    });

    test('does not search again if query is the same', async () => {
        const user = userEvent.setup();

        localStorage.setItem('search', 'pikachu');

        const mockData = {
            items: [
                {
                    id: 1,
                    name: 'pikachu',
                    image: '',
                    height: 4,
                    types: ['electric']
                }
            ],
            next: null,
            previous: null,
        };

        mockedSearch.mockResolvedValue(mockData);

        render(<App />);

        await waitFor(() => {
            expect(mockedSearch).toHaveBeenCalledWith('pikachu');
        });

        await user.click(screen.getByRole('button', { name: /search/i }));

        expect(mockedSearch).toHaveBeenCalledTimes(1);
    });
});