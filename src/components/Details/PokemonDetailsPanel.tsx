import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getPokemonDetails } from '@/lib/pokeapi';
import RefreshButton from '@/components/RefreshButton/RefreshButton';

type PokemonDetailsPanelProps = {
  id: string;
  query: string;
  page: number;
};

// Server component: receives the selected id and fetches the pokemon details
// on the server.
async function PokemonDetailsPanel({
  id,
  query,
  page,
}: PokemonDetailsPanelProps) {
  const t = await getTranslations('Details');
  const pokemon = await getPokemonDetails(id);

  // Closing returns to the list while preserving the active search/page.
  const closeHref = {
    pathname: '/' as const,
    query: { ...(query ? { query } : {}), page: String(page) },
  };

  if (!pokemon) {
    return (
      <div className="details-error">
        <div>{t('notFound')}</div>
        <Link href={closeHref} className="close-btn">
          {t('close')}
        </Link>
      </div>
    );
  }

  return (
    <div className="details">
      <div className="details-header">
        <Link href={closeHref} className="close-btn">
          {t('close')}
        </Link>
        <RefreshButton className="refresh-btn" label={t('refresh')} />
      </div>

      {pokemon.image && (
        <Image
          src={pokemon.image}
          alt={pokemon.name}
          width={220}
          height={220}
          className="details-image"
        />
      )}

      <h2>{pokemon.name}</h2>

      <p>{t('height', { height: pokemon.height })}</p>

      <div className="types">
        {pokemon.types.map((type) => (
          <span key={type} className="type">
            {type}
          </span>
        ))}
      </div>
    </div>
  );
}

export default PokemonDetailsPanel;
