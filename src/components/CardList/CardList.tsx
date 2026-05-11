import { Component } from 'react';
import Card from '../Card/Card';
import type { PokemonCardData } from '../../services/api';

interface Props {
  items: PokemonCardData[];
}

class CardList extends Component<Props> {
  render() {
    return (
      <div className="results-grid">
        {this.props.items.map((item) => (
          <Card
            key={item.id}
            item={item}
          />
        ))}
      </div>
    );
  }
}

export default CardList;