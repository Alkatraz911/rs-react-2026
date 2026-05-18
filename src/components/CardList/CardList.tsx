import Card from '../Card/Card';
import type { PokemonCardData } from '../../services/api';

interface Props {
  items: PokemonCardData[];
}

function CardList({ items }: Props) {
  return (
    <div className="results-grid">
      {items.map((item) => (
        <Card
          key={item.id}
          item={item}
        />
      ))}
    </div>
  );
}

export default CardList;

