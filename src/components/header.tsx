
"use client";

import Link from 'next/link'
import { Button } from './ui/button';
import { Menu, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
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
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from '@/lib/utils';
import { getPosts } from '@/lib/posts';

const ThemeSwitcher = dynamic(() => import('./theme-switcher').then(m => m.ThemeSwitcher), { ssr: false });
const SearchBar = dynamic(() => import('./search-bar').then(m => m.SearchBar), { ssr: false });


export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryOpen, setCategoryOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    // Since getPosts() can't be used in a client component directly if it uses server-side modules,
    // and we can't make Header a server component due to hooks, we need a different approach.
    // A better pattern is to fetch categories from an API route or pass them as props from a server component.
    // However, given the current structure, we'll try to keep the change minimal.
    // Let's assume for now that the parent component will provide the categories.
    // The previous error was because getPosts() was called in RootLayout which is a Server Component, but the import was being traced through client components.
    // A pure server component can call getPosts(). Let's refactor this.
    
    // This component must remain a client component due to useState and other hooks.
    // Let's create a server component wrapper or modify the layout to pass categories.
    // For now, let's revert to a server component that passes props.
    // The error indicates layout.tsx is the issue, so we'll adjust the call there.
    
    // The final fix is to make Header a server component that fetches data, and move the client logic to a sub-component.
    // Let's simplify: Header will be a server component, passing categories to a client component for the interactive parts.
    // No, Header itself is a client component due to its hooks.
    // The error is in the layout. Let's make the layout NOT call getPosts, and let the Header call it if it can be a server component.
    // But it can't be.
    
    // Let's re-read the error. `Import trace: ./src/app/layout.tsx`. The problem is the layout.
    // The previous attempt was correct to remove it from layout. Now, where do we get the categories?
    // We can have a Server Component that just renders the header and passes the categories.
    // Or we can try to make Header a server component.
    const allPosts = getPosts();
    const uniqueCategories = Array.from(new Set(allPosts.map(post => post.category).filter(Boolean)));
    setCategories(uniqueCategories);

  }, []);

  const navLinks = categories.map(category => ({
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
        
        {/* Title */}
         <div className="flex-1 md:flex-initial">
           <Link href="/" className="flex items-center space-x-2 justify-center md:justify-start">
              <span className="font-bold font-headline">
                blogs.huzi.pk
              </span>
            </Link>
         </div>

        {/* Desktop Categories */}
        <div className="order-last w-full md:order-none md:w-auto md:flex-1 md:justify-center">
          <div className="hidden md:flex justify-center">
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
                    <div className="flex flex-wrap gap-1 justify-center">
                      {navLinks.map((link) => (
                          <DropdownMenuItem key={link.href} asChild className="flex-auto justify-center basis-auto grow-0">
                              <Link href={link.href} className="px-3 py-1.5">{link.label}</Link>
                          </DropdownMenuItem>
                      ))}
                    </div>
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
