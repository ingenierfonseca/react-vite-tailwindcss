import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn, theme } from "../../utils/theme";

interface Props {
  title: string;
  options: { id: string | number; value: string }[];
  value?: string | number;
  onChange?: (value: string) => void;
  onSearch: (value: string) => void;
  loadMore: () => void;
  hasMore: boolean;
}

export default function AsyncDropdown({
  title,
  options,
  value,
  onChange,
  onSearch,
  loadMore,
  hasMore,
}: Props) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selected = options.find(o => o.id == value);

  // cerrar al hacer click afuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // scroll infinito
  const handleScroll = () => {
    const el = listRef.current;
    if (!el) return;

    const bottom =
      el.scrollHeight - el.scrollTop <= el.clientHeight + 10;

    if (bottom && hasMore) {
      loadMore();
    }
  };

  return (
    <div ref={containerRef} className="flex flex-1 flex-col w-full relative">
      <label className={`${cn(theme.labelform)}`}>{title}</label>

      {/* input principal */}
      <div
        onClick={() => setOpen(prev => !prev)}
        className="border rounded px-3 py-2 cursor-pointer bg-white flex justify-between items-center"
      >
        <span>
          {selected?.value || "Seleccionar..."}
        </span>
        <span><ChevronDown className="w-4 h-4" /></span>
      </div>

      {/* dropdown */}
      {open && (
        <div className="absolute top-full mt-1 w-full bg-white border rounded shadow-lg z-50">
          
          {/* buscador */}
          <input
            type="text"
            placeholder="Buscar..."
            onChange={(e) => onSearch(e.target.value)}
            className="w-full p-2 border-b outline-none"
          />

          {/* lista */}
          <div
            ref={listRef}
            onScroll={handleScroll}
            className="max-h-48 overflow-auto"
          >
            {options.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onChange?.(String(item.id));
                  setOpen(false);
                }}
                className={`p-2 cursor-pointer hover:bg-gray-100 ${
                  value == item.id ? "bg-blue-100" : ""
                }`}
              >
                {item.value}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}