
"use client";

import Link from 'next/link'
import { ThemeSwitcher } from './theme-switcher'
import { SearchBar } from './search-bar';
import { Button } from './ui/button';
import { Menu } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex items-center">
            <Link href="/" className="mr-6 flex items-center space-x-2">
                <span className="font-bold font-headline sm:inline-block">
                blogs.huzi.pk
                </span>
            </Link>
        </div>
        
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center gap-2">
             <Link href="/category/programming" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary hidden md:block">Programming</Link>
             <Link href="/category/ai" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary hidden md:block">AI</Link>
             <Link href="/category/cybersecurity" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary hidden md:block">Cybersecurity</Link>
             <Link href="/category/linux" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary hidden md:block">Linux</Link>
             <Link href="/category/lifestyle" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary hidden md:block">Lifestyle</Link>
          </nav>
          <SearchBar />
          <ThemeSwitcher />
           <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
           </Button>
        </div>
      </div>
    </header>
  )
}
