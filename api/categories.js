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
  try {
    const db = getPool();
    const [rows] = await db.execute(
      'SELECT id, categoria FROM categorias ORDER BY categoria ASC'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar categorias' });
  }
}