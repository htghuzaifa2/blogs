
'use client';

import Link from 'next/link'
import { Button } from './ui/button';
import { Menu, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from '@/lib/utils';
import useSWR from 'swr';
import { ScrollArea } from './ui/scroll-area';

const ThemeSwitcher = dynamic(() => import('./theme-switcher').then(m => m.ThemeSwitcher), { ssr: false });
const SearchBar = dynamic(() => import('./search-bar').then(m => m.SearchBar), { ssr: false });

import { getSearchData } from '@/lib/cache';

const fetcher = () => getSearchData();

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryOpen, setCategoryOpen] = useState(false);

  const { data: searchData } = useSWR('/search-data.json', fetcher);

  const categories = searchData
    ? Array.from(new Set(searchData.map((post: { category: string }) => post.category).filter(Boolean)))
    : [];

  const navLinks = categories.map((category: string) => ({
    href: `/category/${category.toLowerCase().replace(/ /g, '-')}`,
    label: category
  }));

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-auto min-h-14 flex-wrap items-center justify-between py-2 gap-y-2">

        {/* Mobile Menu */}
        <div className="flex items-center md:hidden">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0">
              <SheetHeader className="p-6 pb-4">
                <SheetTitle className="sr-only">Main Menu</SheetTitle>
                <SheetDescription className="sr-only">
                  Navigate through the site's main sections and categories.
                </SheetDescription>
                <Link href="/" className="mr-6 flex items-center space-x-2" onClick={() => setIsMenuOpen(false)}>
                  <span className="font-bold font-headline sm:inline-block">
                    blogs.huzi.pk
                  </span>
                </Link>
              </SheetHeader>
              <div className="flex flex-col gap-6 px-6 pb-6 pt-2">
                <Link href="/blog" className="text-lg font-medium text-foreground" onClick={() => setIsMenuOpen(false)}>Blog</Link>
                <div className="text-lg font-medium text-foreground">Categories</div>
              </div>

              <ScrollArea className="flex-1 overflow-y-auto pr-6">
                <nav className="flex flex-col gap-4 border-l ml-6 pl-4 pb-6">
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
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>

        {/* Title */}
        <div className="flex-1 md:flex-initial">
          <Link href="/" className="flex items-center space-x-2 justify-center md:justify-start">
            <span className="font-bold font-headline">
              blogs.huzi.pk
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="order-last w-full md:order-none md:w-auto md:flex-1 md:justify-center">
          <div className="hidden md:flex justify-center items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/blog">Blog</Link>
            </Button>
            <DropdownMenu open={isCategoryOpen} onOpenChange={setCategoryOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1" onClick={() => setCategoryOpen(!isCategoryOpen)}>
                  Categories
                  <ChevronDown className={cn("h-4 w-4 transition-transform", isCategoryOpen && "rotate-180")} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="center"
                className="w-auto max-w-[calc(100vw-2rem)] sm:max-w-md md:max-w-lg lg:max-w-xl p-2"
              >
                <ScrollArea className="h-auto max-h-[40vh]">
                  <div className="flex flex-wrap gap-1 justify-center">
                    {navLinks.map((link) => (
                      <DropdownMenuItem key={link.href} asChild className="flex-auto justify-center basis-auto grow-0">
                        <Link href={link.href} className="px-3 py-1.5">{link.label}</Link>
                      </DropdownMenuItem>
                    ))}
                  </div>
                </ScrollArea>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>


        {/* Search and Theme */}
        <div className="flex items-center justify-end space-x-2 md:flex-initial">
          <SearchBar />
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  )
}
