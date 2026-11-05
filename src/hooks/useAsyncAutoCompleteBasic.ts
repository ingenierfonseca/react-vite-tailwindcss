import { debounce } from "@mui/material";
import { useEffect, useMemo, useState } from "react";

export const useAsyncAutocompleteBasic = <T>({
  fetchData,
  getValue,
  getLabel,
}: {
  fetchData: (value: any | null) => Promise<T[]>;
  getValue: (item: T) => string | number;
  getLabel: (item: T) => string;
}) => {
  const [options, setOptions] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const res = await fetchData(1);

        const mapped = res.map(item => ({
          value: getValue(item),
          label: getLabel(item),
          raw: item,
        }));

        setOptions(prev => {
          return [...prev, ...mapped];
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [search]);

  const onSearchChange = (val: string) => {
    setSearch(val);
  };

  const debouncedSetSearch = useMemo(
    () => debounce((val: string) => onSearchChange(val), 300),
    []
  );

  return {
    options,
    search,
    debouncedSetSearch,
    loading
  };
};