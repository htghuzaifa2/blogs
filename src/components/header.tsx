
"use client";

import Link from 'next/link'
import { ThemeSwitcher } from './theme-switcher'
import { SearchBar } from './search-bar';
import { Button } from './ui/button';
import { Menu, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from '@/lib/utils';

interface HeaderProps {
  categories: string[];
}

export function Header({ categories }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryOpen, setCategoryOpen] = useState(false);

  const navLinks = categories.map(category => ({
    href: `/category/${category.toLowerCase().replace(/ /g, '-')}`,
    label: category
  }));

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-auto min-h-14 flex-wrap items-center py-2">
        <div className="mr-4 hidden md:flex items-center flex-wrap">
           <Link href="/" className="mr-6 flex items-center space-x-2 py-2">
            <span className="font-bold font-headline sm:inline-block">
              blogs.huzi.pk
            </span>
          </Link>
          <DropdownMenu open={isCategoryOpen} onOpenChange={setCategoryOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-1">
                Categories
                <ChevronDown className={cn("h-4 w-4 transition-transform", isCategoryOpen && "rotate-180")} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {navLinks.map((link) => (
                 <DropdownMenuItem key={link.href} asChild>
                    <Link href={link.href}>{link.label}</Link>
                 </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex flex-1 items-center justify-between md:justify-end space-x-2">
           <div className="md:hidden">
             <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="flex flex-col gap-6 p-6">
                  <Link href="/" className="mr-6 flex items-center space-x-2" onClick={() => setIsMenuOpen(false)}>
                      <span className="font-bold font-headline sm:inline-block">
                      blogs.huzi.pk
                      </span>
                  </Link>
                   <div className="text-lg font-medium text-foreground">Categories</div>
                  <nav className="flex flex-col gap-4 border-l pl-4">
                    {navLinks.map((link) => (
                      <Link 
                        key={link.href}
                        href={link.href} 
                        className="text-base font-medium text-muted-foreground transition-colors hover:text-primary"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
           </div>
           
           <div className="md:hidden flex-1">
             <Link href="/" className="flex items-center space-x-2 justify-center">
                <span className="font-bold font-headline">
                  blogs.huzi.pk
                </span>
              </Link>
           </div>

          <div className="flex items-center justify-end space-x-2">
            <SearchBar />
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </header>
  )
}
