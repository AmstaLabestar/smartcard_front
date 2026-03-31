import { PageIntro } from '../../../shared/ui/PageIntro';

export function AdminDataTable({ title, columns, rows, emptyMessage, eyebrow = 'Admin' }) {
  return (
    <section className="content-card admin-table-card premium-support-card">
      <div className="admin-table-header admin-table-header-polished">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
        </div>
        <span className="admin-table-count">{rows.length}</span>
      </div>
      {rows.length === 0 ? (
        <p className="muted">{emptyMessage}</p>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column.key}>{column.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={row.id || rowIndex}>
                  {columns.map((column) => (
                    <td key={column.key}>{column.render ? column.render(row) : row[column.key]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
