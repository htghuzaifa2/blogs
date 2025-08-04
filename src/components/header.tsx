
"use client";

import Link from 'next/link'
import { ThemeSwitcher } from './theme-switcher'
import { SearchBar } from './search-bar';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { getPosts } from '@/lib/posts';
import { useMemo, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Button } from './ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

export function Header() {
  const posts = getPosts();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const categories = useMemo(() => {
    const categorySet = new Set<string>();
    posts.forEach(post => {
      if(post.category) {
        categorySet.add(post.category);
      }
    });
    return Array.from(categorySet).sort();
  }, [posts]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 md:mr-6 flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold font-headline sm:inline-block">
              blogs.huzi.pk
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-1 items-center justify-start space-x-2 ml-6">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                    {categories.map((category) => (
                      <li key={category}>
                        <NavigationMenuLink asChild>
                           <a
                              href={`/category/${category.toLowerCase().replace(/ /g, '-')}`}
                              className={cn(
                                "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              )}
                              aria-label={`View posts in the ${category} category`}
                            >
                              <div className="text-sm font-medium leading-none">{category}</div>
                          </a>
                        </NavigationMenuLink>
                      </li>
                    ))}
                    {categories.length === 0 && (
                       <li className="p-3 text-sm text-muted-foreground">No categories found.</li>
                    )}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <SearchBar />
          <ThemeSwitcher />

          {/* Mobile Navigation */}
          {isClient && isMobile && (
             <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full max-w-sm">
                <SheetHeader className="text-left border-b pb-4">
                  <SheetTitle className="font-headline text-2xl">Menu</SheetTitle>
                   <Button variant="ghost" size="icon" className="absolute top-3 right-3" onClick={() => setMobileMenuOpen(false)}>
                      <X className="h-5 w-5" />
                      <span className="sr-only">Close menu</span>
                   </Button>
                </SheetHeader>
                <div className="mt-6">
                  <h3 className="mb-4 text-lg font-semibold font-headline px-2">Categories</h3>
                  <ul className="space-y-1">
                    {categories.map((category) => (
                      <li key={category}>
                        <Link 
                          href={`/category/${category.toLowerCase().replace(/ /g, '-')}`}
                          className="block p-2 rounded-md hover:bg-accent text-base"
                          aria-label={`View posts in the ${category} category`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {category}
                        </Link>
                      </li>
                    ))}
                     {categories.length === 0 && (
                       <li className="p-2 text-sm text-muted-foreground">No categories to display.</li>
                    )}
                  </ul>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  )
}
