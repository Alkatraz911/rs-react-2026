import type { PokemonCardData } from '../../services/api';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface Props {
  item: PokemonCardData;
}

function Card({ item }: Props) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleOpenDetails = () => {
    navigate({
      pathname: `/pokemon/${item.id}`,
      search: searchParams.toString(),
    });
  };

  return (
    <div
      className="card"
      onClick={handleOpenDetails}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          handleOpenDetails();
        }
      }}
    >
      <img
        src={item.image}
        alt={item.name}
      />

      <h3>{item.name}</h3>

      <p>Height: {item.height}</p>

      <div className="types">
        {item.types.map((type) => (
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

export default Card;

