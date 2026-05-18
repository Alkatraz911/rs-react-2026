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
  count: number;
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

const transformPokemon = (
  details: PokemonDetailsResponse
): PokemonCardData => ({
  id: details.id,
  name: details.name,
  image: details.sprites.front_default,
  height: details.height,
  types: details.types.map(
    (t) => t.type.name
  ),
});

const fetchPokemonDetails = async (
  url: string
): Promise<PokemonCardData> => {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error('Failed details');
  }

  const data: PokemonDetailsResponse =
    await res.json();

  return transformPokemon(data);
};

export const fetchPokemons = async (
  offset = 0,
  limit = 21
): Promise<PokemonPageData> => {
  const res = await fetch(
    `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
  );

  if (!res.ok) {
    throw new Error('Failed to fetch pokemons');
  }

  const data: PokemonListResponse =
    await res.json();

  const items = await Promise.all(
    data.results.map((pokemon) =>
      fetchPokemonDetails(pokemon.url)
    )
  );

  return {
    items,
    next: data.next,
    previous: data.previous,
    count: data.count,
  };
};

export const searchPokemons = async (
  query: string,
  page = 1,
  limit = 21
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

  const offset = (page - 1) * limit;

  const paginated = filtered.slice(
    offset,
    offset + limit
  );

  const items = await Promise.all(
    paginated.map((pokemon) =>
      fetchPokemonDetails(pokemon.url)
    )
  );

  return {
    items,
    next: null,
    previous: null,
    count: filtered.length,
  };
};

export const fetchPokemonById = async (
  id: string
): Promise<PokemonCardData> => {
  const res = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${id}`
  );

  if (!res.ok) {
    throw new Error('Failed to fetch pokemon');
  }

  const data: PokemonDetailsResponse =
    await res.json();

  return transformPokemon(data);
};

