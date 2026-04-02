import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import express from 'express';
import productsHandler from './api/products.js';
import categoriesHandler from './api/categories.js';
import imageHandler from './api/image.js';
import marcasHandler from './api/marcas.js';
const app = express();

app.get('/api/products', productsHandler);
app.get('/api/categories', categoriesHandler);
app.get('/api/marcas', marcasHandler);
app.get('/api/image', imageHandler);

app.listen(3001, () => console.log('API rodando em http://localhost:3001'));