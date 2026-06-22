import type { PokemonCardData } from '@/services/api';

const BASE_URL = 'https://pokeapi.co/api/v2';

export const PAGE_SIZE = 20;

// Upper bound used for client-side style name filtering during search.
const SEARCH_POOL_SIZE = 1000;

interface PokemonListItem {
  name: string;
  url: string;
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
    front_default: string | null;
  };
  types: {
    type: {
      name: string;
    };
  }[];
}

export interface ResultsPage {
  items: PokemonCardData[];
  totalPages: number;
  count: number;
}

function revalidateSeconds(): number {
  const ttl = process.env.CACHE_TTL_MINUTES;
  const minutes = ttl ? Number.parseInt(ttl, 10) : 5;
  return Number.isFinite(minutes) ? minutes * 60 : 5 * 60;
}

function transformPokemon(details: PokemonDetailsResponse): PokemonCardData {
  return {
    id: details.id,
    name: details.name,
    image: details.sprites.front_default,
    height: details.height,
    types: details.types.map((entry) => entry.type.name),
  };
}

async function fetchDetailsByUrl(url: string): Promise<PokemonCardData> {
  const res = await fetch(url, { next: { revalidate: revalidateSeconds() } });

  if (!res.ok) {
    throw new Error(`Failed to fetch pokemon details (${res.status})`);
  }

  const data: PokemonDetailsResponse = await res.json();
  return transformPokemon(data);
}

async function getPokemonList(page: number): Promise<ResultsPage> {
  const offset = (page - 1) * PAGE_SIZE;

  const res = await fetch(
    `${BASE_URL}/pokemon?offset=${offset}&limit=${PAGE_SIZE}`,
    { next: { revalidate: revalidateSeconds() } }
  );

  if (!res.ok) {
    throw new Error(`Failed to load pokemon list (${res.status})`);
  }

  const data: PokemonListResponse = await res.json();
  const items = await Promise.all(
    data.results.map((pokemon) => fetchDetailsByUrl(pokemon.url))
  );

  return {
    items,
    count: data.count,
    totalPages: Math.max(1, Math.ceil(data.count / PAGE_SIZE)),
  };
}

async function searchPokemons(
  query: string,
  page: number
): Promise<ResultsPage> {
  const res = await fetch(`${BASE_URL}/pokemon?limit=${SEARCH_POOL_SIZE}`, {
    next: { revalidate: revalidateSeconds() },
  });

  if (!res.ok) {
    throw new Error(`Search failed (${res.status})`);
  }

  const data: PokemonListResponse = await res.json();
  const normalizedQuery = query.toLowerCase();

  const filtered = data.results.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(normalizedQuery)
  );

  const offset = (page - 1) * PAGE_SIZE;
  const paginated = filtered.slice(offset, offset + PAGE_SIZE);
  const items = await Promise.all(
    paginated.map((pokemon) => fetchDetailsByUrl(pokemon.url))
  );

  return {
    items,
    count: filtered.length,
    totalPages: Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)),
  };
}

export async function getPokemonResults({
  query,
  page,
}: {
  query: string;
  page: number;
}): Promise<ResultsPage> {
  return query ? searchPokemons(query, page) : getPokemonList(page);
}

export async function getPokemonDetails(
  id: string
): Promise<PokemonCardData | null> {
  const res = await fetch(`${BASE_URL}/pokemon/${id}`, {
    next: { revalidate: revalidateSeconds() },
  });

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error(`Failed to load pokemon (${res.status})`);
  }

  const data: PokemonDetailsResponse = await res.json();
  return transformPokemon(data);
}

export async function getPokemonsByIds(
  ids: number[]
): Promise<PokemonCardData[]> {
  return Promise.all(ids.map((id) => fetchDetailsByUrl(`${BASE_URL}/pokemon/${id}`)));
}
