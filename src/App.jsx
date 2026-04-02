import { useProducts, useCategories, useMarcas } from './hooks/useProducts';
import ProductCard from './components/ProductCard';
import Pagination  from './components/Pagination';

export default function App() {
  const categories = useCategories();
  const marcas = useMarcas();
  const {
    search, setSearch,
    cat, setCat,
    marca, setMarca,
    page, setPage,
    data, meta,
    loading, error,
    exportCSV
  } = useProducts();

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fb', fontFamily: "'DM Sans', sans-serif" }}>

      {/* Header */}
      <header style={{
        background: '#fff',
        borderBottom: '1px solid #e8eaed',
        padding: '0 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: '#1a56db', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={{ fontWeight: 600, fontSize: 16, color: '#111' }}>RocoBR - Catálogo de Produtos</span>
        </div>
        <button
          onClick={exportCSV}
          disabled={loading}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: '#f0f4ff', border: '1px solid #c7d7f9',
            color: '#1a56db', borderRadius: 8, padding: '7px 14px',
            fontSize: 13, fontWeight: 500, cursor: 'pointer',
            opacity: loading ? 0.5 : 1,
          }}
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
            <path d="M12 3v12m0 0l-4-4m4 4l4-4M3 17v2a2 2 0 002 2h14a2 2 0 002-2v-2"
              stroke="#1a56db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Exportar CSV
        </button>
      </header>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem' }}>
        
        {/* Banner desktop */}
        <div style={{
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'center',
        }} className="hidden sm:flex">
          <img
            src="/topo_banner.png"
            alt="Banner RocoBR"
            style={{ maxWidth: '100%', borderRadius: 8 }}
          />
        </div>

        {/* Aviso */}
        <div style={{
          background: '#fffbeb',
          border: '1px solid #f59e0b',
          borderLeft: '4px solid #f59e0b',
          borderRadius: 8,
          padding: '14px 18px',
          marginBottom: '1.5rem',
          display: 'flex',
          gap: 12,
          alignItems: 'flex-start',
        }}>
          <span style={{ fontSize: 20, lineHeight: 1 }}>⚠️</span>
          <p style={{ margin: 0, fontSize: 14, color: '#92400e', lineHeight: 1.6 }}>
            Estes produtos estão à venda após fechamento da empresa RocoBR. <br /> Caso tenha interesse,
            pode entrar em contato através do fone{' '}
            <a href="tel:+5548991454664" style={{ color: '#92400e', fontWeight: 600 }}>
              (48) 99145-4664
            </a>
            {' '}ou do email{' '}
            <a href="mailto:renanekr@gmail.com" style={{ color: '#92400e', fontWeight: 600 }}>
              renanekr@gmail.com
            </a>
          </p>
        </div>
        {/* Barra de busca */}
        <div style={{
          background: '#fff', borderRadius: 12,
          border: '1px solid #e8eaed',
          padding: '1.25rem 1.5rem',
          marginBottom: '1.5rem',
          display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center',
        }}>
          <div style={{ flex: 1, minWidth: 240, position: 'relative' }}>
            <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
              width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por título, referência ou marca..."
              style={{
                width: '100%', boxSizing: 'border-box',
                border: '1px solid #e8eaed', borderRadius: 8,
                padding: '9px 12px 9px 38px',
                fontSize: 14, color: '#111', outline: 'none',
                background: '#f8f9fb',
              }}
            />
          </div>

          <select
            value={cat}
            onChange={e => setCat(e.target.value)}
            style={{
              border: '1px solid #e8eaed', borderRadius: 8,
              padding: '9px 32px 9px 12px', fontSize: 14,
              color: '#374151', background: '#f8f9fb',
              outline: 'none', cursor: 'pointer', minWidth: 180,
            }}
          >
            <option value="">Todas as categorias</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.categoria}</option>
            ))}
          </select>
          <select
            value={marca}
            onChange={e => setMarca(e.target.value)}
            style={{
              border: '1px solid #e8eaed', borderRadius: 8,
              padding: '9px 32px 9px 12px', fontSize: 14,
              color: '#374151', background: '#f8f9fb',
              outline: 'none', cursor: 'pointer', minWidth: 160,
            }}
          >
            <option value="">Todas as marcas</option>
            {marcas.map(m => (
              <option key={m.produto_marca} value={m.produto_marca}>{m.produto_marca}</option>
            ))}
          </select>

          {/* Contador de resultados */}
          {!loading && (
            <span style={{ fontSize: 13, color: '#6b7280', whiteSpace: 'nowrap' }}>
              {meta.total} {meta.total === 1 ? 'produto' : 'produtos'}
            </span>
          )}
        </div>

        {/* Erro */}
        {error && (
          <div style={{
            background: '#fef2f2', border: '1px solid #fecaca',
            borderRadius: 8, padding: '12px 16px',
            color: '#dc2626', fontSize: 14, marginBottom: '1rem',
          }}>
            {error}
          </div>
        )}

        {/* Grid de cards */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} style={{
                background: '#fff', borderRadius: 12, border: '1px solid #e8eaed',
                height: 300, animation: 'pulse 1.5s infinite',
              }} />
            ))}
          </div>
        ) : data.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '4rem 0', color: '#9ca3af',
          }}>
            <svg width="48" height="48" fill="none" viewBox="0 0 24 24" style={{ margin: '0 auto 1rem', display: 'block' }}>
              <path d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <p style={{ fontSize: 15, fontWeight: 500, color: '#6b7280' }}>Nenhum produto encontrado</p>
            <p style={{ fontSize: 13, marginTop: 4 }}>Tente outros termos de busca</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '1rem',
          }}>
            {data.map(p => <ProductCard key={p.produto_id} product={p} />)}
          </div>
        )}

        {/* Paginação */}
        <Pagination
          page={page}
          totalPages={meta.totalPages}
          total={meta.total}
          onPageChange={setPage}
        />
      </main>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}