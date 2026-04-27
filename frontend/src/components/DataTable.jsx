import { useMemo, useState } from 'react';
import { Icon } from './icons.jsx';
import { SkeletonRows } from './Skeleton.jsx';

/**
 * columns: [{ key, label, sortable?, render?(row), width?, align? }]
 * data:    array of row objects
 * actions: [{ label, icon, onClick(row), tone? }]
 */
export function DataTable({
  title,
  columns,
  data,
  actions,
  loading = false,
  error,
  searchable = true,
  searchKeys,
  onAdd,
  addLabel = 'Ajouter',
  emptyLabel = 'Aucune donnée à afficher.',
}) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [query, setQuery] = useState('');

  const handleSort = (col) => {
    if (!col.sortable) return;
    if (sortKey === col.key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(col.key);
      setSortDir('asc');
    }
  };

  const view = useMemo(() => {
    let rows = Array.isArray(data) ? [...data] : [];
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      const keys = searchKeys ?? columns.map((c) => c.key);
      rows = rows.filter((r) =>
        keys.some((k) => String(r[k] ?? '').toLowerCase().includes(q))
      );
    }
    if (sortKey) {
      rows.sort((a, b) => {
        const av = a[sortKey], bv = b[sortKey];
        if (av == null) return 1;
        if (bv == null) return -1;
        if (typeof av === 'number' && typeof bv === 'number') return av - bv;
        return String(av).localeCompare(String(bv), 'fr', { numeric: true });
      });
      if (sortDir === 'desc') rows.reverse();
    }
    return rows;
  }, [data, query, sortKey, sortDir, columns, searchKeys]);

  const colCount = columns.length + (actions?.length ? 1 : 0);

  return (
    <div className="table-card">
      <div className="table-toolbar">
        <div className="table-toolbar-title">{title}</div>
        <div className="table-toolbar-actions">
          {searchable && (
            <div className="table-search">
              <span className="table-search-icon"><Icon.Search width={14} height={14} /></span>
              <input
                type="search"
                placeholder="Rechercher…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Rechercher"
              />
            </div>
          )}
          {onAdd && (
            <button type="button" className="btn btn--primary btn--sm" onClick={onAdd}>
              <Icon.Plus width={14} height={14} /> {addLabel}
            </button>
          )}
        </div>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              {columns.map((col) => {
                const isSorted = sortKey === col.key;
                return (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col)}
                    className={[
                      col.sortable ? 'is-sortable' : '',
                      isSorted ? 'is-sorted' : '',
                    ].join(' ').trim()}
                    style={{ width: col.width, textAlign: col.align }}
                  >
                    {col.label}
                    {col.sortable && (
                      <span className="sort-indicator">
                        {isSorted ? (sortDir === 'asc' ? '▲' : '▼') : '↕'}
                      </span>
                    )}
                  </th>
                );
              })}
              {actions?.length ? <th style={{ width: 110, textAlign: 'right' }}>Actions</th> : null}
            </tr>
          </thead>

          {loading ? (
            <SkeletonRows rows={5} cols={colCount} />
          ) : error ? (
            <tbody><tr><td colSpan={colCount} className="table-error">{error}</td></tr></tbody>
          ) : view.length === 0 ? (
            <tbody><tr><td colSpan={colCount} className="table-empty">{emptyLabel}</td></tr></tbody>
          ) : (
            <tbody>
              {view.map((row, i) => (
                <tr key={row.id ?? i}>
                  {columns.map((col) => (
                    <td key={col.key} style={{ textAlign: col.align }}>
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                  {actions?.length ? (
                    <td style={{ textAlign: 'right' }}>
                      <div className="row-actions">
                        {actions.map((a, idx) => {
                          const ICmp = a.icon;
                          return (
                            <button
                              key={idx}
                              type="button"
                              className={'icon-btn' + (a.tone === 'danger' ? ' is-danger' : '')}
                              onClick={() => a.onClick(row)}
                              title={a.label}
                              aria-label={a.label}
                            >
                              {ICmp ? <ICmp width={14} height={14} /> : a.label}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
}
