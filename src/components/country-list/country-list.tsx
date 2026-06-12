import { memo, useMemo, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { Country } from '../../types';
import { CountryCard } from '../country-card/country-card';
import { getPopulationForYear, createYearDataMap } from '../../utils/data-transformers';

import styles from './country-list.module.css';

type CountryListProps = {
  countries: Country[];
  searchQuery: string;
  selectedColumns: string[];
  selectedRegion: string;
  selectedYear: number;
  sortField: 'name' | 'population';
  sortOrder: 'asc' | 'desc';
  onYearChange: (year: number) => void;
};

export const CountryList = memo(
  ({
    countries,
    searchQuery,
    selectedColumns,
    selectedRegion,
    selectedYear,
    sortField,
    sortOrder,
  }: CountryListProps) => {
    const parentRef = useRef<HTMLDivElement>(null);

    const filteredCountries = useMemo(() => {
      const filtered = countries.filter((c) => {
        const matchesSearch = c.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRegion = !selectedRegion || c.data.some((d) => d.region === selectedRegion);
        return matchesSearch && matchesRegion;
      });

      if (sortField === 'population') {
        const populations = new Map<string, number>();
        filtered.forEach((c) => {
          populations.set(c.id, getPopulationForYear(createYearDataMap(c.data), selectedYear) || 0);
        });
        return filtered.sort((a, b) => {
          const diff = (populations.get(a.id) || 0) - (populations.get(b.id) || 0);
          return sortOrder === 'asc' ? diff : -diff;
        });
      }

      return filtered.sort((a, b) =>
        sortOrder === 'asc' ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id)
      );
    }, [countries, searchQuery, selectedRegion, selectedYear, sortField, sortOrder]);

    const virtualizer = useVirtualizer({
      count: filteredCountries.length,
      getScrollElement: () => parentRef.current,
      estimateSize: () => 180 + selectedColumns.length * 30,
      overscan: 5,
    });

    return (
      <div ref={parentRef} className={styles.countryList}>
        <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
          {virtualizer.getVirtualItems().map((virtualItem) => {
            const country = filteredCountries[virtualItem.index];
            return (
              <div
                key={country.id}
                data-index={virtualItem.index}
                ref={virtualizer.measureElement}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                <CountryCard
                  country={country}
                  selectedYear={selectedYear}
                  selectedColumns={selectedColumns}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);
