'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleSelected } from '@/store/selectedSlice';
import type { PokemonCardData } from '@/services/api';

type CardProps = {
  item: PokemonCardData;
  query: string;
  page: number;
};

function Card({ item, query, page }: CardProps) {
  const t = useTranslations('Card');
  const dispatch = useAppDispatch();

  const isSelected = useAppSelector((state) =>
    state.selected.items.some((i) => i.id === item.id)
  );

  const detailsHref = {
    pathname: '/' as const,
    query: {
      ...(query ? { query } : {}),
      page: String(page),
      details: String(item.id),
    },
  };

  return (
    <div className={`card${isSelected ? ' card--selected' : ''}`}>
      <label className="card-checkbox">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => dispatch(toggleSelected(item))}
          aria-label={t('select', { name: item.name })}
        />
      </label>

      <Link href={detailsHref} className="card-link">
        {item.image && (
          <Image src={item.image} alt={item.name} width={120} height={120} />
        )}

        <h3>{item.name}</h3>

        <p>{t('height', { height: item.height })}</p>

        <div className="types">
          {item.types.map((type) => (
            <span key={type} className="type">
              {type}
            </span>
          ))}
        </div>
      </Link>
    </div>
  );
}

export default Card;
