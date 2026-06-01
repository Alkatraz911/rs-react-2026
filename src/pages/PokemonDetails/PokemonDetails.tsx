import {
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';

import Loader from '../../components/Loader/Loader';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';

import { usePokemonDetails } from '../../hooks/usePokemonDetails';

function PokemonDetails() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [searchParams] =
    useSearchParams();

  const query =
    searchParams.get('query') || '';

  const page =
    searchParams.get('page') || '1';

  const {
    pokemon,
    loading,
    error,
    refetch,
  } = usePokemonDetails(id);

  const handleClose = () => {
    const params =
      new URLSearchParams();

    if (query) {
      params.set('query', query);
    }

    params.set('page', page);

    navigate({
      pathname: '/',
      search: params.toString(),
    });
  };

  const handleRefresh = () => {
    refetch();
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="details-error">
        <ErrorMessage message={error} />
        <button
          className="refresh-btn"
          onClick={handleRefresh}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!pokemon) {
    return null;
  }

  return (
    <div className="details">
      <div className="details-header">
        <button
          className="close-btn"
          onClick={handleClose}
        >
          Close
        </button>
        <button
          className="refresh-btn"
          onClick={handleRefresh}
        >
          Refresh
        </button>
      </div>

      <img
        src={pokemon.image ?? undefined}
        alt={pokemon.name}
        className="details-image"
      />

      <h2>{pokemon.name}</h2>

      <p>
        Height: {pokemon.height}
      </p>

      <div className="types">
        {pokemon.types.map((type) => (
          <span
            key={type}
            className="type"
          >
            {type}
          </span>
        ))}
      </div>
    </div>
  );
}

export default PokemonDetails;

