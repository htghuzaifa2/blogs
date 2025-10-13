
import type { Metadata } from 'next';
import { Inter, Lora } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { getPosts } from '@/lib/posts';
import { cn } from '@/lib/utils';
import { ClickTracker } from '@/components/click-tracker';
import { Prefetcher } from '@/components/prefetcher';
import { ScrollToTop } from '@/components/scroll-to-top';
import dynamic from 'next/dynamic';

const ProductPopup = dynamic(() => import('@/components/product-popup').then(m => m.ProductPopup), { ssr: false });

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
});


const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blogs.huzi.pk';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Blogs.huzi.pk – AI, Tech, and Lifestyle Blogs by Huzi',
    template: '%s – blogs.huzi.pk',
  },
  description: 'Explore insightful blogs on AI, technology, programming, lifestyle, and education. Your hub for tutorials, guides, and trending topics from Pakistan.',
  keywords: [
    'AI blogs', 
    'technology blogs', 
    'programming tutorials', 
    'coding blogs', 
    'web development blogs', 
    'lifestyle blogs', 
    'education blogs', 
    'trending topics', 
    'Pakistan blogs', 
    'blogging hub', 
    'online tutorials',
    'knowledge hub',
    'Huzi'
  ],
  openGraph: {
    title: {
      default: 'Blogs.huzi.pk – AI, Tech, and Lifestyle Blogs by Huzi',
      template: '%s – blogs.huzi.pk',
    },
    description: 'Explore insightful blogs on AI, technology, programming, lifestyle, and education from Pakistan.',
    url: siteUrl,
    siteName: 'blogs.huzi.pk',
    images: [
      {
        url: 'https://huzi.pk/img/26PWX8FW/logo.webp',
        width: 1200,
        height: 630,
        alt: 'blogs.huzi.pk Logo'
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    card: 'summary_large_image',
    title: {
      default: 'Blogs.huzi.pk – AI, Tech, and Lifestyle Blogs by Huzi',
      template: '%s – blogs.huzi.pk',
    },
    description: 'Explore insightful blogs on AI, technology, programming, lifestyle, and education from Pakistan.',
    images: ['https://huzi.pk/img/26PWX8FW/logo.webp'],
  },
  alternates: {
    canonical: siteUrl,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const posts = getPosts();
  const categories = Array.from(new Set(posts.map(post => post.category).filter(Boolean)));
  
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="https://huzi.pk/img/26PWX.PK/logo.webp" type="image/webp" sizes="any" />
      </head>
      <body className={cn("font-body antialiased overflow-x-hidden transition-colors duration-300", inter.variable, lora.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          <ClickTracker>
            <div className="flex flex-col min-h-screen">
              <Header categories={categories} />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
            <Toaster />
            <ScrollToTop />
            <ProductPopup />
          </ClickTracker>
        </ThemeProvider>
        <Prefetcher />
      </body>
    </html>
  );
}
