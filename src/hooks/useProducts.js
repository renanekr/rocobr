import { useState, useEffect, useCallback } from 'react';

function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export function useCategories() {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(setCategories);
  }, []);
  return categories;
}

export function useProducts() {
  const [search, setSearch] = useState('');
  const [cat, setCat]       = useState('');
  const [page, setPage]     = useState(1);
  const [data, setData]     = useState([]);
  const [meta, setMeta]     = useState({ total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const debouncedSearch = useDebounce(search);

  useEffect(() => { setPage(1); }, [debouncedSearch, cat]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      search: debouncedSearch,
      cat,
      page,
      limit: 10,
    });

    fetch(`/api/products?${params}`, { signal: controller.signal })
      .then(r => r.json())
      .then(json => { setData(json.data); setMeta(json.meta); })
      .catch(err => { if (err.name !== 'AbortError') setError('Erro ao carregar produtos'); })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [debouncedSearch, cat, page]);

  const exportCSV = useCallback(() => {
    const params = new URLSearchParams({ search, cat, export: '1' });
    window.open(`/api/products?${params}`, '_blank');
  }, [search, cat]);

  return { search, setSearch, cat, setCat, page, setPage, data, meta, loading, error, exportCSV };
}