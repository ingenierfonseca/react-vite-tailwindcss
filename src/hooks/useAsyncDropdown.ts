import { useEffect, useState } from "react";
import { mapToDropdown } from "../utils/dropdow.util";

export const useAsyncDropdown = <T>({
  fetchData,
  getValue,
  getLabel,
}: {
  fetchData: (params: { page: number; search: string }) => Promise<{ data: T[] }>
  getValue: (item: T) => string | number
  getLabel: (item: T) => string
}) => {
  const [options, setOptions] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setOptions([]);
    setPage(1);
  }, [search]);

  useEffect(() => {
    loadData();
  }, [page, search]);

  const loadData = async () => {
    setLoading(true);

    const res = await fetchData({ page, search });

    const mapped = mapToDropdown(res.data, getValue, getLabel);

    setOptions(prev => (page === 1 ? mapped : [...prev, ...mapped]));
    setHasMore(res.data.length > 0);

    setLoading(false);
  };

  return {
    options,
    search,
    setSearch,
    loading,
    hasMore,
    setPage,
  };
};