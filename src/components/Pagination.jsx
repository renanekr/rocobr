export default function Pagination({ page, totalPages, total, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      marginTop: '2rem', padding: '1rem 0',
    }}>
      <span style={{ fontSize: 13, color: '#6b7280' }}>
        Página {page} de {totalPages} — {total} produtos
      </span>
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={() => onPageChange(p => p - 1)}
          disabled={page === 1}
          style={{
            padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500,
            border: '1px solid #e8eaed', background: '#fff', cursor: 'pointer',
            color: '#374151', opacity: page === 1 ? 0.4 : 1,
          }}
        >← Anterior</button>
        <button
          onClick={() => onPageChange(p => p + 1)}
          disabled={page >= totalPages}
          style={{
            padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500,
            border: '1px solid #e8eaed', background: '#fff', cursor: 'pointer',
            color: '#374151', opacity: page >= totalPages ? 0.4 : 1,
          }}
        >Próxima →</button>
      </div>
    </div>
  );
}