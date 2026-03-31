import {
  Autocomplete,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useAsyncAutocomplete } from "../../hooks/useAsyncAutoComplete";

type Props<T> = {
  label: string;
  value?: string | number | null;
  onChange?: (value: any, item: T | null) => void;
  fetchData: (params: {
    page: number;
    search: string;
  }) => Promise<{
    data: T[];
    currentPage: number;
    totalPages: number;
  }>;
  getValue: (item: T) => string | number;
  getLabel: (item: T) => string;
};

export function PaginatedAutocomplete<T>({
  label,
  value,
  onChange,
  fetchData,
  getValue,
  getLabel,
}: Props<T>) {
  const {
    options,
    debouncedSetSearch,
    loading,
    hasMore,
    loadNextPage,
  } = useAsyncAutocomplete({
    fetchData,
    getValue,
    getLabel,
  });

  const [selected, setSelected] = useState<any>(null);

  // 🔥 Manejo PRO de valores externos
  useEffect(() => {
    if (!value) {
      setSelected(null);
      return;
    }

    const found = options.find(o => o.value === value);
    if (found) setSelected(found);
  }, [value, options]);

  return (
    <Autocomplete
      className="flex-1"
      options={options}
      value={selected}
      loading={loading}

      onChange={(_, newValue) => {
        setSelected(newValue);
        onChange?.(newValue?.value, newValue?.raw || null);
      }}

      onInputChange={(_, val, reason) => {
        if (reason === 'input') {
          debouncedSetSearch(val);
        }

        if (reason === 'clear') {
          debouncedSetSearch("");
        }
      }}

      getOptionLabel={(option) => option.label}

      isOptionEqualToValue={(option, val) =>
        option.value === val.value
      }

      slotProps={{
        listbox: {
          style: { maxHeight: 300, overflow: 'auto' },
          onScroll: (e: React.UIEvent<HTMLUListElement>) => {
            const listbox = e.currentTarget;
            const isBottom =
              listbox.scrollTop + listbox.clientHeight >=
              listbox.scrollHeight - 10;

            if (isBottom && hasMore && !loading) {
              loadNextPage();
            }
          },
        },
        paper: {
          style: { maxHeight: 300 },
        },
      }}

      renderInput={(params) => <TextField 
        {...params} 
        label={label}
        slotProps={{
        input: {
          ...params.InputProps,
          endAdornment: (
            <>
              {loading ? <CircularProgress color="inherit" size={18} /> : null}
              {params.InputProps.endAdornment}
            </>
          ),
        }
      }}
      />}
    />
  );
}