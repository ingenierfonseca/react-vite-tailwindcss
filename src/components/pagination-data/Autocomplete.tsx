import {
  Autocomplete,
  CircularProgress,
  InputAdornment,
  TextField,
} from "@mui/material";
import { SearchIcon } from "lucide-react";

type Props<T> = {
  label?: string;
  ariaLabelledBy?: string;
  options: T[];
  value?: string | number | null;
  disabled?: boolean;
  loading?: boolean;
  required?: boolean;
  onChange?: (value: string | number | null, item: T | null) => void;
  getValue: (item: T) => string | number;
  getLabel: (item: T) => string;
};

export function AutocompleteBasic<T>({
  label,
  ariaLabelledBy,
  options,
  value,
  disabled = false,
  loading = false,
  required = false,
  onChange,
  getValue,
  getLabel,
}: Props<T>) {
  const selected = value == null
    ? null
    : options.find((option) => getValue(option) === value) ?? null;

  return (
    <Autocomplete<T>
      className="w-full min-w-0"
      size="small"
      options={options}
      value={selected}
      loading={loading}
      disabled={disabled}
      onChange={(_, item) => onChange?.(item ? getValue(item) : null, item)}
      getOptionLabel={getLabel}
      isOptionEqualToValue={(option, selectedOption) => (
        getValue(option) === getValue(selectedOption)
      )}
      slotProps={{
        listbox: { style: { maxHeight: 300, overflow: "auto" } },
        paper: { style: { maxHeight: 300 } },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          required={required}
          slotProps={{
            input: {
              ...params.InputProps,
              startAdornment: (
                <>
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                  {params.InputProps.startAdornment}
                </>
              ),
              endAdornment: (
                <>
                  {loading ? <CircularProgress color="inherit" size={18} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            },
            htmlInput: {
              ...params.inputProps,
              "aria-labelledby": ariaLabelledBy,
            },
          }}
        />
      )}
    />
  );
}
