import { Component } from 'react';
import type { PokemonCardData } from '../../services/api';

interface Props {
    item: PokemonCardData;
}

class Card extends Component<Props> {
    render() {
        const { item } = this.props;

        return (
            <div className="card">
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
}

export default Card;