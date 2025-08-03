
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, X, History } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const RECENT_SEARCHES_KEY = "huzi-blog-recent-searches";

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const storedSearches = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (storedSearches) {
      setRecentSearches(JSON.parse(storedSearches));
    }
  }, []);

  const updateRecentSearches = (searchTerm: string) => {
    const updatedSearches = [searchTerm, ...recentSearches.filter(s => s !== searchTerm).slice(0, 4)];
    setRecentSearches(updatedSearches);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updatedSearches));
  };

  const handleSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) return;

    const term = searchTerm.trim();
    updateRecentSearches(term);
    router.push(`/search?q=${encodeURIComponent(term)}`);
    setQuery("");
    setIsOpen(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  };
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="h-9 w-9">
          <Search className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="grid gap-4">
          <form onSubmit={handleFormSubmit} className="flex gap-2">
            <Input
              placeholder="Search posts..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1"
              autoFocus
            />
            <Button type="submit" size="icon" variant="secondary">
              <Search className="h-4 w-4" />
            </Button>
          </form>

          {recentSearches.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-sm leading-none">Recent Searches</h4>
                <Button variant="link" size="sm" className="h-auto p-0" onClick={clearRecentSearches}>Clear</Button>
              </div>
              <div className="grid gap-2">
                {recentSearches.map((searchTerm, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start text-sm text-muted-foreground"
                    onClick={() => handleSearch(searchTerm)}
                  >
                    <History className="mr-2 h-4 w-4" />
                    {searchTerm}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
