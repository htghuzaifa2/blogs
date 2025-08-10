
"use client";

import Link from 'next/link'
import { ThemeSwitcher } from './theme-switcher'
import { SearchBar } from './search-bar';
import { Button } from './ui/button';
import { Menu, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
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

  const navLinks = categories.map(category => ({
    href: `/category/${category.toLowerCase().replace(/ /g, '-')}`,
    label: category
  }));

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
           <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold font-headline sm:inline-block">
              blogs.huzi.pk
            </span>
          </Link>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-3 p-4 md:w-[250px] lg:w-[300px]">
                    {navLinks.map((link) => (
                      <ListItem
                        key={link.href}
                        href={link.href}
                        title={link.label}
                      />
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
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

          <div className="flex-1 md:flex-none">
            <SearchBar />
          </div>
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  )
}

const ListItem = (({ className, title, href, ...props }) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href!}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
        </Link>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
