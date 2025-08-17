import type { Metadata } from 'next';
import { PT_Sans, Playfair_Display } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { getPosts } from '@/lib/posts';
import { cn } from '@/lib/utils';

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-pt-sans',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-playfair-display',
});


const siteUrl = 'https://blogs.huzi.pk';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Huzi Blogs - Tech, AI, and Programming Insights',
    template: '%s - blogs.huzi.pk',
  },
  description: 'Explore expert articles and tutorials on AI, programming, web development, and technology trends. Your go-to resource for actionable insights from Huzi Blogs.',
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
      default: 'Huzi Blogs - Tech, AI, and Programming Insights',
      template: '%s - blogs.huzi.pk',
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
      default: 'Huzi Blogs - Tech, AI, and Programming Insights',
      template: '%s - blogs.huzi.pk',
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
      </head>
      <body className={cn("font-body antialiased", ptSans.variable, playfairDisplay.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
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
