'use client';

import { useTranslations } from 'next-intl';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { unselectAll } from '@/store/selectedSlice';

function Flyout() {
  const t = useTranslations('Flyout');
  const dispatch = useAppDispatch();
  const selectedItems = useAppSelector((state) => state.selected.items);

  if (selectedItems.length === 0) {
    return null;
  }

  const ids = selectedItems.map((item) => item.id).join(',');
  const downloadHref = `/api/csv?ids=${ids}`;

  return (
    <div className="flyout" role="region" aria-label={t('region')}>
      <span className="flyout-count">
        {t('selected', { count: selectedItems.length })}
      </span>

      <div className="flyout-actions">
        <button
          className="flyout-btn flyout-btn--unselect"
          onClick={() => dispatch(unselectAll())}
        >
          {t('unselectAll')}
        </button>

        <a
          className="flyout-btn flyout-btn--download"
          href={downloadHref}
          download={`${selectedItems.length}_items.csv`}
        >
          {t('download')}
        </a>
      </div>
    </div>
  );
}

export default Flyout;
