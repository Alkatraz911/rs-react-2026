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

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <ErrorMessage message={error} />
    );
  }

  if (!pokemon) {
    return null;
  }

  return (
    <div className="details">
      <button
        className="close-btn"
        onClick={handleClose}
      >
        Close
      </button>

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

