import Card from '@/components/Card/Card';
import type { PokemonCardData } from '@/services/api';

type CardListProps = {
  items: PokemonCardData[];
  query: string;
  page: number;
};

function CardList({ items, query, page }: CardListProps) {
  return (
    <div className="results-grid">
      {items.map((item) => (
        <Card key={item.id} item={item} query={query} page={page} />
      ))}
    </div>
  );
}

export default CardList;
