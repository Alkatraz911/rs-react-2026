import { Component } from 'react';
import { fetchPokemons, searchPokemons } from './services/api';
import type { PokemonCardData } from './services/api';
import Search from './components/Search/Search';
import CardList from './components/CardList/CardList';
import Loader from './components/Loader/Loader';
import ErrorMessage from './components/ErrorMessage/ErrorMessage';

interface State {
  query: string;
  items: PokemonCardData[];
  loading: boolean;
  error: string | null;
  offset: number;
  next: string | null;
  prev: string | null;
  hasTestError: boolean;
  currentPage: number;
}

class App extends Component<object, State> {
  state: State = {
    query: '',
    items: [],
    loading: false,
    error: null,
    offset: 0,
    next: null,
    prev: null,
    hasTestError: false,
    currentPage: 1,
  };

  componentDidMount() {
    const saved = localStorage.getItem('search') || '';

    this.setState(
      {
        query: saved,
      },
      this.loadData
    );
  }

  loadData = async () => {
    this.setState({ loading: true, error: null });

    try {
      const { query, offset } = this.state;

      if (query) {
        const items = await searchPokemons(query);

        this.setState({
          items,
          next: null,
          previous: null,
        });
      } else {
        const data = await fetchPokemons(offset);

        this.setState({
          items: data.items,
          next: data.next,
          prev: data.previous,
        });
      }
    } catch {
      this.setState({
        error: 'Failed to load data',
      });
    } finally {
      this.setState({
        loading: false,
      });
    }
  };
  handleSearch = (value: string) => {
    const trimmed = value.trim();

    if (trimmed === this.state.query) return;

    localStorage.setItem('search', trimmed);

    this.setState(
      {
        query: trimmed,
        offset: 0,
      },
      this.loadData
    );
  };

  handlePageChange = (page: number) => {
    this.setState(
      {
        currentPage: page,
        offset: (page - 1) * 20,
      },
      this.loadData
    );
  };
  render() {
    if (this.state.hasTestError) {
      throw new Error('Test error');
    }
    const { items, loading, error, query } = this.state;

    return (
      <div className="app">
        <div className="search">
          <Search onSearch={this.handleSearch} defaultValue={query} />
        </div>

        <div className="results">
          {loading && <Loader />}
          {error && <ErrorMessage message={error} />}
          {!loading && !error && <CardList items={items} />}
        </div>

        <button
          className="error-btn"
          onClick={() =>
            this.setState({
              hasTestError: true,
            })
          }
        >
          Test Error
        </button>
        <div className="pagination">
          <button
            disabled={!this.state.prev}
            onClick={() =>
              this.handlePageChange(
                this.state.currentPage - 1
              )
            }
          >
            Prev
          </button>

          <div className="pages">
            {Array.from({ length: 10 }, (_, i) => (
              <button
                key={i + 1}
                className={
                  this.state.currentPage === i + 1
                    ? 'page active'
                    : 'page'
                }
                onClick={() =>
                  this.handlePageChange(i + 1)
                }
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            disabled={!this.state.next}
            onClick={() =>
              this.handlePageChange(
                this.state.currentPage + 1
              )
            }
          >
            Next
          </button>
        </div>
      </div>
    );
  }
}

export default App;