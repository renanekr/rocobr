export default async function handler(req, res) {
    const { file } = req.query;
    if (!file) return res.status(400).end();
  
    const url = `http://renan.floripa.br/rocobr/fotos/${file}`;
    console.log('Buscando imagem:', url);
  
    try {
      const response = await fetch(url);
      console.log('Status da resposta:', response.status);
  
      if (!response.ok) return res.status(404).end();
  
      const arrayBuffer = await response.arrayBuffer();
      const contentType = response.headers.get('content-type') || 'image/jpeg';
  
      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.end(new Uint8Array(arrayBuffer));
    } catch (err) {
      console.error('Erro:', err.message);
      res.status(500).end();
    }
  }
