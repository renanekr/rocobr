import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import mysql from 'mysql2/promise';

console.log('Tentando conectar em:', process.env.DB_HOST);

try {
  const conn = await mysql.createConnection({
    host:     process.env.DB_HOST,
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port:     parseInt(process.env.DB_PORT || '3306'),
  });

  console.log('✅ Conectado com sucesso!');
  await conn.end();
} catch (err) {
  console.error('❌ Erro:', err.message);
  console.error('Código:', err.code);
}