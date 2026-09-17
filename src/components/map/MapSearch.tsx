import React from 'react';
import { Search, X } from 'lucide-react';

interface Props {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const MapSearch: React.FC<Props> = ({ searchQuery, onSearchChange }) => {
  return (
    <div className="relative w-full">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7D9187]" />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search waste, recycler or industry..."
        className="w-full pl-10 pr-10 py-2.5 text-sm font-sans bg-white border border-[#D9DDD5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#238B57]/30 focus:border-[#238B57] text-[#14221D] placeholder:text-[#7D9187] transition-all"
      />
      {searchQuery && (
        <button
          type="button"
          onClick={() => onSearchChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-[#E5EFE8] text-[#7D9187] hover:text-[#12372A] transition cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
