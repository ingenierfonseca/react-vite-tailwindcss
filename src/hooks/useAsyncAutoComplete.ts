import { debounce } from "@mui/material";
import { useEffect, useMemo, useState } from "react";

export const useAsyncAutocomplete = <T,>({
  fetchData,
  getValue,
  getLabel,
}: {
  fetchData: (params: { page: number; search: string }) => Promise<{
    data: T[];
    currentPage: number;
    totalPages: number;
  }>;
  getValue: (item: T) => string | number;
  getLabel: (item: T) => string;
}) => {
  const [options, setOptions] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  /*useEffect(() => {
    setOptions([]);
    setPage(1);
  }, [search]);

  useEffect(() => {
    loadData();
  }, [page, search]);

  const loadData = async () => {
    if (loading) return;

    setLoading(true);

    const res = await fetchData({ page, search });

    const mapped = res.data.map(item => ({
      value: getValue(item),
      label: getLabel(item),
      raw: item,
    }));

    setOptions(prev => {
      const merged = page === 1 ? mapped : [...prev, ...mapped];

      // evitar duplicados
      return Array.from(
        new Map(merged.map(o => [o.value, o])).values()
      );
    });

    setHasMore(res.currentPage < res.totalPages);

    setLoading(false);
  };*/

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const res = await fetchData({ page, search });

        const mapped = res.data.map(item => ({
          value: getValue(item),
          label: getLabel(item),
          raw: item,
        }));

        setOptions(prev => {
          // Si es página 1, reemplazamos. Si no, concatenamos.
          return page === 1 ? mapped : [...prev, ...mapped];
        });
        console.log("currentPage:", res.currentPage, "totalPages:", res.totalPages);
        setHasMore(res.currentPage < res.totalPages);
        setTotalPages(res.totalPages);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [page, search]);

  const onSearchChange = (val: string) => {
    setOptions([]);
    setPage(1);
    setSearch(val);
  };

  const loadNextPage = () => {
    if (!hasMore || loading) return;
    console.log("Loading next page:", page + 1);
    if (page < totalPages) 
      setPage(prev => prev + 1);
  };

  const debouncedSetSearch = useMemo(
    () => debounce((val: string) => onSearchChange(val), 300),
    []
  );

  return {
    options,
    search,
    debouncedSetSearch,
    loading,
    hasMore,
    loadNextPage,
  };
};