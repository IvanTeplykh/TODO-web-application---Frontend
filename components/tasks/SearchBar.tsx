"use client";

import React, { useEffect, useState } from "react";
import { useTaskStore } from "../../store/taskStore";
import { useDebounce } from "../../hooks/useDebounce";
import { Search } from "lucide-react";
import { Input } from "../ui/Input";

export function SearchBar() {
  const { search, setFilters } = useTaskStore();
  const [val, setVal] = useState(search);
  const [prevSearch, setPrevSearch] = useState(search);
  
  if (search !== prevSearch) {
    setVal(search);
    setPrevSearch(search);
  }

  const debouncedSearch = useDebounce(val, 300);

  useEffect(() => {
    setFilters({ search: debouncedSearch });
  }, [debouncedSearch, setFilters]);

  return (
    <div className="w-full">
      <Input
        placeholder="Search tasks..."
        value={val}
        onChange={(e) => setVal(e.target.value)}
        icon={<Search className="h-4.5 w-4.5" />}
        className="w-full shadow-sm"
      />
    </div>
  );
}
