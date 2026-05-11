
export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonCardData {
  id: number;
  name: string;
  image: string;
  height: number;
  types: string[];
}
export interface PokemonPageData {
  items: PokemonCardData[];
  next: string | null;
  previous: string | null;
}

interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

interface PokemonDetailsResponse {
  id: number;
  name: string;
  height: number;

  sprites: {
    front_default: string;
  };

  types: {
    type: {
      name: string;
    };
  }[];
}

export const fetchPokemons = async (
  offset = 0,
  limit = 20
): Promise<PokemonPageData> => {
  const res = await fetch(
    `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
  );

  if (!res.ok) {
    throw new Error('Failed to fetch pokemons');
  }

  const data: PokemonListResponse =
    await res.json();

  const detailedPokemons = await Promise.all(
    data.results.map(async (pokemon) => {
      const detailsRes = await fetch(pokemon.url);

      if (!detailsRes.ok) {
        throw new Error('Failed details');
      }

      const details: PokemonDetailsResponse =
        await detailsRes.json();

      return {
        id: details.id,
        name: details.name,
        image: details.sprites.front_default,
        height: details.height,
        types: details.types.map(
          (t) => t.type.name
        ),
      };
    })
  );

  return {
    items: detailedPokemons,
    next: data.next,
    previous: data.previous,
  };
};

export const searchPokemons = async (
  query: string
): Promise<PokemonPageData> => {
  const res = await fetch(
    'https://pokeapi.co/api/v2/pokemon?limit=1000'
  );

  if (!res.ok) {
    throw new Error('Search failed');
  }

  const data: PokemonListResponse =
    await res.json();

  const filtered = data.results.filter((pokemon) =>
    pokemon.name
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  const detailedPokemons = await Promise.all(
    filtered.map(async (pokemon) => {
      const detailsRes = await fetch(pokemon.url);

      if (!detailsRes.ok) {
        throw new Error('Failed details');
      }

      const details: PokemonDetailsResponse =
        await detailsRes.json();

      return {
        id: details.id,
        name: details.name,
        image: details.sprites.front_default,
        height: details.height,
        types: details.types.map(
          (t) => t.type.name
        ),
      };
    })
  );

  return {
    items: detailedPokemons,
    next: null,
    previous: null,
  };
};
