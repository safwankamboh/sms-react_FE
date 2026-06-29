import { Search, X } from 'lucide-react'
import Input from './Input'

function SearchBar({ value, onChange, onClear, placeholder = 'Search...', className }) {
  return (
    <div className={`relative ${className || ''}`}>
      <Input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        icon={Search}
        placeholder={placeholder}
        className="pr-10"
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          aria-label="Clear search"
        >
          <X size={15} />
        </button>
      )}
    </div>
  )
}

export default SearchBar
