import {
  Autocomplete,
  TextField,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import { useEffect, useState } from "react";
import { SearchIcon } from "lucide-react";
import { useAsyncAutocompleteBasic } from "@/hooks/useAsyncAutoCompleteBasic";

type Props<T> = {
  label: string;
  value?: string | number | null;
  disabled?: boolean;
  onChange?: (value: any, item: T | null) => void;
  fetchData: (value: any | null) => Promise<T[]>;
  getValue: (item: T) => string | number;
  getLabel: (item: T) => string;
};

export function AutocompleteBasic<T>({
  label,
  value,
  disabled,
  onChange,
  fetchData,
  getValue,
  getLabel,
}: Props<T>) {
  const {
    options,
    debouncedSetSearch,
    loading,
  } = useAsyncAutocompleteBasic({
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
      size="small"
      options={options}
      value={selected}
      loading={loading}
      disabled={disabled}

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
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
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