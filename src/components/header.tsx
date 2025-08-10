
"use client";

import Link from 'next/link'
import { ThemeSwitcher } from './theme-switcher'
import { SearchBar } from './search-bar';
import { Button } from './ui/button';
import { Menu, X, ChevronDown } from 'lucide-react';
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

interface HeaderProps {
  categories: string[];
}

export function Header({ categories }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = categories.map(category => ({
    href: `/category/${category.toLowerCase().replace(/ /g, '-')}`,
    label: category
  }));

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Link href="/" className="mr-6 flex items-center space-x-2 group">
                  <span className="font-bold font-headline sm:inline-block">
                  blogs.huzi.pk
                  </span>
                  <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </Link>
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
        
        <div className="flex flex-1 items-center justify-end space-x-2">
          <SearchBar />
          <ThemeSwitcher />
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
                  <nav className="flex flex-col gap-4">
                    {navLinks.map((link) => (
                      <Link 
                        key={link.href}
                        href={link.href} 
                        className="text-lg font-medium text-muted-foreground transition-colors hover:text-primary"
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
        </div>
      </div>
    </header>
  )
}
