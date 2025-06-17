"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

interface SearchFormProps {
  defaultValue: string;
}

export function SearchForm({ defaultValue }: SearchFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(defaultValue);
  const currentTitulo = searchParams.get("titulo") || "";

  const handleSearch = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      
      const params = new URLSearchParams(searchParams.toString());
      params.set("titulo", searchValue);
      params.set("page", "1");
      
      router.replace(`/libros?${params.toString()}`, { scroll: false });
    },
    [router, searchParams, searchValue]
  );

  const isDisabled = searchValue === currentTitulo;

  return (
    <div className="flex gap-2">
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          type="text"
          placeholder="Buscar por título..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="w-[300px]"
        />
        <Button type="submit" disabled={isDisabled}>
          <Search className="h-4 w-4 mr-2" />
          Buscar
        </Button>
      </form>
    </div>
  );
} 