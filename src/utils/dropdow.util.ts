import type { DropDownAppModel } from "../models/dropdownapp.type";

export const mapToDropdown = <T>(
  data: T[],
  getValue: (item: T) => string | number,
  getLabel: (item: T) => string
): DropDownAppModel[] => {
  return data.map(item => ({
    id: getValue(item),
    value: getLabel(item)
  }));
};