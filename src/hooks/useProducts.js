import { useState, useEffect, useCallback, useRef } from 'react';

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
    fetch('/api/categories').then(r => r.json()).then(setCategories).catch(() => {});
  }, []);
  return categories;
}

export function useMarcas() {
  const [marcas, setMarcas] = useState([]);
  useEffect(() => {
    fetch('/api/marcas').then(r => r.json()).then(setMarcas).catch(() => {});
  }, []);
  return marcas;
}

export function useProducts() {
  const [search, setSearch] = useState('');
  const [cat, setCat]       = useState('');
  const [marca, setMarca]   = useState('');
  const [page, setPage]     = useState(1);
  const [state, setState]   = useState({
    data: [],
    meta: { total: 0, totalPages: 1 },
    loading: false,
    error: null,
  });

  const debouncedSearch = useDebounce(search);
  const pageRef = useRef(page);
  // eslint-disable-next-line react-hooks/refs
  pageRef.current = page;

  const handleSetSearch = useCallback((v) => { setSearch(v); setPage(1); }, []);
  const handleSetCat    = useCallback((v) => { setCat(v);    setPage(1); }, []);
  const handleSetMarca  = useCallback((v) => { setMarca(v);  setPage(1); }, []);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    const params = new URLSearchParams({
      search: debouncedSearch,
      cat,
      marca,
      page,
      limit: 12,
    });

    setState(s => ({ ...s, loading: true, error: null }));

    fetch(`/api/products?${params}`, { signal: controller.signal })
      .then(r => r.json())
      .then(json => {
        if (!cancelled) {
          setState({ data: json.data, meta: json.meta, loading: false, error: null });
        }
      })
      .catch(err => {
        if (!cancelled && err.name !== 'AbortError') {
          setState(s => ({ ...s, loading: false, error: 'Erro ao carregar produtos' }));
        }
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [debouncedSearch, cat, marca, page]);

  const exportCSV = useCallback(() => {
    const params = new URLSearchParams({ search, cat, marca, export: '1' });
    window.open(`/api/products?${params}`, '_blank');
  }, [search, cat, marca]);

  return {
    search, setSearch: handleSetSearch,
    cat,    setCat:    handleSetCat,
    marca,  setMarca:  handleSetMarca,
    page,   setPage,
    data:    state.data,
    meta:    state.meta,
    loading: state.loading,
    error:   state.error,
    exportCSV,
  };
}