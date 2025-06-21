"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon, SearchIconHandle } from "@/components/ui/search";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { X } from "lucide-react";

interface SearchFormProps {
  defaultValue: string;
}

export function SearchForm({ defaultValue }: SearchFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(defaultValue);
  const currentNumero = searchParams.get("numero") || "";
  const searchIconRef = useRef<SearchIconHandle>(null);

  const handleSearch = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      
      const params = new URLSearchParams(searchParams.toString());
      params.set("numero", searchValue);
      params.set("page", "1");
      
      router.replace(`/facturas?${params.toString()}`, { scroll: false });
    },
    [router, searchParams, searchValue]
  );

  const handleClear = useCallback(() => {
    setSearchValue("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("numero");
    params.set("page", "1");
    router.replace(`/facturas?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  const isDisabled = searchValue === currentNumero;
  const showClearButton = searchValue.length > 0;

  return (
    <div className="flex gap-2">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative">
          <Input
            type="text"
            placeholder="Buscar por número..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full sm:w-[300px] pr-8"
          />
          {showClearButton && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button 
          type="submit" 
          disabled={isDisabled}
          onMouseEnter={() => searchIconRef.current?.startAnimation()}
          onMouseLeave={() => searchIconRef.current?.stopAnimation()}
        >
          <SearchIcon ref={searchIconRef} className="h-4 w-4" />
          <span className="hidden sm:block">Buscar</span>
        </Button>
      </form>
    </div>
  );
} 