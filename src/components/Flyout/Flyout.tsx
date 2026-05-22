import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { unselectAll } from '../../store/selectedSlice';

function downloadCSV(items: { id: number; name: string; image: string | null; height: number; types: string[] }[]) {
  const header = 'id,name,height,types,details_url';
  const rows = items.map((item) => {
    const detailsUrl = `${window.location.origin}/pokemon/${item.id}`;
    return `${item.id},${item.name},${item.height},"${item.types.join('|')}",${detailsUrl}`;
  });
  const csv = [header, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${items.length}_items.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function Flyout() {
  const dispatch = useAppDispatch();
  const selectedItems = useAppSelector((state) => state.selected.items);

  if (selectedItems.length === 0) {
    return null;
  }

  return (
    <div className="flyout" role="region" aria-label="Selected items">
      <span className="flyout-count">
        {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
      </span>

      <div className="flyout-actions">
        <button
          className="flyout-btn flyout-btn--unselect"
          onClick={() => dispatch(unselectAll())}
        >
          Unselect all
        </button>

        <button
          className="flyout-btn flyout-btn--download"
          onClick={() => downloadCSV(selectedItems)}
        >
          Download
        </button>
      </div>
    </div>
  );
}

export default Flyout;
