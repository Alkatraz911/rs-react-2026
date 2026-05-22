import type { PokemonCardData } from '../../services/api';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleSelected } from '../../store/selectedSlice';

interface Props {
  item: PokemonCardData;
}

function Card({ item }: Props) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();

  const isSelected = useAppSelector((state) =>
    state.selected.items.some((i) => i.id === item.id)
  );

  const handleOpenDetails = () => {
    navigate({
      pathname: `/pokemon/${item.id}`,
      search: searchParams.toString(),
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    dispatch(toggleSelected(item));
  };

  return (
    <div
      className={`card${isSelected ? ' card--selected' : ''}`}
      onClick={handleOpenDetails}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          handleOpenDetails();
        }
      }}
    >
      <label
        className="card-checkbox"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleCheckboxChange}
          aria-label={`Select ${item.name}`}
        />
      </label>

      <img
        src={item.image ?? undefined}
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