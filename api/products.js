import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import mysql from 'mysql2/promise';

let pool;
function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host:     process.env.DB_HOST,
      user:     process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port:     parseInt(process.env.DB_PORT || '3306'),
      waitForConnections: true,
      connectionLimit: 5,
    });
  }
  return pool;
}

export default async function handler(req, res) {
  const { search = '', cat = '', page = '1', limit = '10', export: doExport } = req.query;

  const db       = getPool();
  const pageNum  = Math.max(1, parseInt(page));
  const limitNum = Math.min(100, parseInt(limit));
  const offset   = (pageNum - 1) * limitNum;
  const like     = `%${search.trim()}%`;

  const catFilter  = cat ? 'AND p.produto_cat = ?' : '';
  const baseParams = cat ? [like, like, like, cat] : [like, like, like];

  const baseWhere = `
    FROM produtos p
    LEFT JOIN categorias c ON p.produto_cat = c.id
    WHERE (
      p.produto_titulo LIKE ? OR
      p.produto_ref    LIKE ? OR
      p.produto_marca  LIKE ?
    )
    ${catFilter}
  `;

  try {
    if (doExport === '1') {
      const [rows] = await db.execute(
        `SELECT p.produto_id, p.produto_ref, p.produto_titulo, p.produto_marca,
                c.categoria, p.produto_real, p.produto_euro, p.produto_dolar,
                p.produto_qtd, p.produto_disp
         ${baseWhere} ORDER BY p.produto_titulo ASC`,
        baseParams
      );

      const header = 'ID,Referência,Título,Marca,Categoria,R$,€,$,Qtd,Disponível\n';
      const csv = header + rows.map(r =>
        `${r.produto_id},"${r.produto_ref}","${r.produto_titulo}","${r.produto_marca ?? ''}","${r.categoria ?? ''}",${r.produto_real},${r.produto_euro},${r.produto_dolar},${r.produto_qtd},"${r.produto_disp ?? ''}"`
      ).join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="produtos.csv"');
      return res.send(csv);
    }

    const [rows] = await db.execute(
      `SELECT p.produto_id, p.produto_ref, p.produto_titulo, p.produto_marca,
              p.produto_mini, p.produto_foto, c.categoria,
              p.produto_real, p.produto_euro, p.produto_dolar,
              p.produto_qtd, p.produto_disp
       ${baseWhere} ORDER BY p.produto_titulo ASC
       LIMIT ? OFFSET ?`,
      [...baseParams, limitNum, offset]
    );

    const [[{ total }]] = await db.execute(
      `SELECT COUNT(*) AS total ${baseWhere}`,
      baseParams
    );

    res.json({
      data: rows,
      meta: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
}