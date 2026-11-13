
interface SearchAppProps {
    label: string,
    value: string,
    onChange: (value: string) =>void
}
export default function SearchApp({label, value, onChange}: SearchAppProps) {
    return (
        <div className="flex-1">
          <label className="sr-only" htmlFor="clients-search">{label}</label>
          <input
            id="clients-search"
            type="search"
            value={value}
            placeholder={value}
            onChange={(event) => onChange(event.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 md:max-w-md"
          />
        </div>
    )
}