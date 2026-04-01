import { useState } from 'react';

export default function ProductCard({ product: p }) {
  const [imgError, setImgError] = useState(false);

  const hasImg = p.produto_foto && !imgError;

  return (
    <div style={{
      background: '#fff',
      borderRadius: 12,
      border: '1px solid #e8eaed',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      transition: 'box-shadow 0.15s, transform 0.15s',
      cursor: 'default',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Imagem */}
      <div style={{
        height: 180, background: '#f8f9fb',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', flexShrink: 0,
      }}>
        {hasImg ? (
          <img
            // src={p.produto_foto}
            // src={`http://renan.floripa.br/rocobr/fotos/${p.produto_foto}`}
            src={`/api/image?file=${p.produto_foto}`}
            alt={p.produto_titulo}
            onError={() => setImgError(true)}
            style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 12 }}
          />
        ) : (
          <svg width="40" height="40" fill="none" viewBox="0 0 24 24">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="#d1d5db" strokeWidth="1.5"/>
            <path d="M3 16l5-5 4 4 3-3 6 6" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>

      {/* Conteúdo */}
      <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>

        {/* Categoria + Marca */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {p.categoria && (
            <span style={{
              fontSize: 11, fontWeight: 500, padding: '2px 8px',
              background: '#eff6ff', color: '#1d4ed8', borderRadius: 99,
            }}>{p.categoria}</span>
          )}
          {p.produto_marca && (
            <span style={{
              fontSize: 11, fontWeight: 500, padding: '2px 8px',
              background: '#f3f4f6', color: '#6b7280', borderRadius: 99,
            }}>{p.produto_marca}</span>
          )}
        </div>

        {/* Título */}
        <p style={{
          fontSize: 14, fontWeight: 500, color: '#111',
          margin: 0, lineHeight: 1.4,
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {p.produto_titulo}
        </p>

        {/* Ref */}
        <p style={{ fontSize: 12, color: '#9ca3af', margin: 0, fontFamily: "'DM Mono', monospace" }}>
          {p.produto_ref}
        </p>

        {/* Preços + Estoque */}
        <div style={{ marginTop: 'auto', paddingTop: 8, borderTop: '1px solid #f3f4f6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: 16, fontWeight: 600, color: '#111' }}>
              R$ {Number(p.produto_real).toFixed(2)}
            </span>
            <span style={{ fontSize: 12, color: '#9ca3af' }}>
              € {Number(p.produto_euro).toFixed(2)}
            </span>
          </div>
          <div style={{ marginTop: 4, fontSize: 12, color: p.produto_qtd > 0 ? '#16a34a' : '#dc2626' }}>
            {p.produto_qtd > 0 ? `${p.produto_qtd} em estoque` : 'Sem estoque'}
          </div>
        </div>
      </div>
    </div>
  );
}