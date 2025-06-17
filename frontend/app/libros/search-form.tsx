"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface SearchFormProps {
  defaultValue: string;
}

export function SearchForm({ defaultValue }: SearchFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const searchValue = formData.get("titulo") as string;
      
      const params = new URLSearchParams(searchParams.toString());
      params.set("titulo", searchValue);
      params.set("page", "1"); // Reset to first page on new search
      
      router.replace(`/libros?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  return (
    <div className="flex gap-2">
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          type="text"
          placeholder="Buscar por título..."
          name="titulo"
          defaultValue={defaultValue}
          className="w-[300px]"
        />
        <Button type="submit">
          <Search className="h-4 w-4 mr-2" />
          Buscar
        </Button>
      </form>
    </div>
  );
} 