import { type NextRequest } from 'next/server';
import { getPokemonsByIds } from '@/lib/pokeapi';
import type { PokemonCardData } from '@/services/api';

function escapeCsv(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function buildCsv(items: PokemonCardData[], origin: string): string {
  const header = ['id', 'name', 'height', 'types', 'details_url'].join(',');

  const rows = items.map((item) =>
    [
      String(item.id),
      escapeCsv(item.name),
      String(item.height),
      escapeCsv(item.types.join('|')),
      escapeCsv(`${origin}/?details=${item.id}`),
    ].join(',')
  );

  return [header, ...rows].join('\n');
}

// Route handler: compiles the CSV for the selected items on the server and
// serves it as a downloadable file (Feature 8).
export async function GET(request: NextRequest) {
  const idsParam = request.nextUrl.searchParams.get('ids') ?? '';

  const ids = idsParam
    .split(',')
    .map((value) => Number.parseInt(value, 10))
    .filter((value) => Number.isInteger(value) && value > 0);

  if (ids.length === 0) {
    return new Response('No items selected', { status: 400 });
  }

  const items = await getPokemonsByIds(ids);
  const csv = buildCsv(items, request.nextUrl.origin);

  return new Response(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${items.length}_items.csv"`,
    },
  });
}
