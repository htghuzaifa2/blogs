import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { getPosts } from '@/lib/posts';

const siteUrl = 'https://blogs.huzi.pk';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'blogs.huzi.pk',
    template: '%s | blogs.huzi.pk',
  },
  description: 'Welcome to blogs.huzi.pk - A collection of thoughts, stories, and ideas on programming, AI, and technology.',
  keywords: [
    'Programming', 
    'Web Development', 
    'AI', 
    'Cybersecurity', 
    'Linux', 
    'JavaScript', 
    'Python', 
    'C#', 
    'HTML', 
    'CSS', 
    'React', 
    'Next.js', 
    'Kali Linux', 
    'Arch Linux', 
    'WordPress Security',
    'Cloudflare'
  ],
  openGraph: {
    title: {
      default: 'blogs.huzi.pk',
      template: '%s | blogs.huzi.pk',
    },
    description: 'A collection of thoughts, stories, and ideas on programming, AI, and technology.',
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
      default: 'blogs.huzi.pk',
      template: '%s | blogs.huzi.pk',
    },
    description: 'A collection of thoughts, stories, and ideas on programming, AI, and technology.',
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
        <link rel="icon" href="https://huzi.pk/img/26PWX8FW/logo.webp" type="image/webp" sizes="any" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider>
          <div className="flex flex-col min-h-screen">
            <Header categories={categories} />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
