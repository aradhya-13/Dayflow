/**
 * Table — consistent header/row styling with empty state.
 *
 * Props:
 *   columns: [{ key: 'name', label: 'Full Name' }, ...]
 *   rows: array of objects (keys match column.key)
 *   renderCell: optional fn(key, value, row) for custom cell rendering
 *   emptyMessage: string shown when rows is empty
 *   loading: shows skeleton rows
 *
 * Example:
 *   <Table
 *     columns={[{ key: 'name', label: 'Name' }, { key: 'status', label: 'Status' }]}
 *     rows={employees}
 *     renderCell={(key, value) => key === 'status' ? <Badge variant="success">{value}</Badge> : value}
 *   />
 */
export default function Table({ columns = [], rows = [], renderCell, emptyMessage = 'No data found', loading = false }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-neutral-50 border-b border-neutral-200">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide whitespace-nowrap"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {loading &&
            Array.from({ length: 4 }).map((_, i) => (
              <tr key={i}>
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3">
                    <div className="h-4 bg-neutral-100 rounded animate-pulse" />
                  </td>
                ))}
              </tr>
            ))}

          {!loading && rows.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-4 py-10 text-center text-neutral-400 text-sm">
                {emptyMessage}
              </td>
            </tr>
          )}

          {!loading &&
            rows.map((row, i) => (
              <tr key={row._id || i} className="hover:bg-neutral-50 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-neutral-700 whitespace-nowrap">
                    {renderCell ? renderCell(col.key, row[col.key], row) : row[col.key] ?? '—'}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
