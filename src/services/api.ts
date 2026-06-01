export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonCardData {
  id: number;
  name: string;
  image: string | null;
  height: number;
  types: string[];
}

export interface PokemonPageData {
  items: PokemonCardData[];
  next: string | null;
  previous: string | null;
  count: number;
}
