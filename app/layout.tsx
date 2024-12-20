import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { Toaster } from "@/components/ui/sonner"
import Link from 'next/link';
import { Analytics } from '@/components/Analytics';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: "YouTube To Blogs",
  description: "Transform YouTube Videos into Engaging Blog Posts",
  openGraph: {
    type: "website",
    title: "YouTube To Blogs",
    description: "Transform YouTube Videos into Engaging Blog Posts",
    url: "https://youtubetoblogs.souryax.tech",
    siteName: "YouTube To Blogs",
    images: [{
      url: "https://res.cloudinary.com/diyxwdtjd/image/upload/v1734703380/projects/Screenshot_2024-12-20_at_7.28.23_PM_puk8vi.png",
      width: 1200,
      height: 630,
      alt: "YouTube To Blogs Preview Image",
    }],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "YouTube To Blogs",
    description: "Transform YouTube Videos into Engaging Blog Posts",
    site: "https://youtubetoblogs.souryax.tech",
    images: [{
      url: "https://res.cloudinary.com/diyxwdtjd/image/upload/v1734703380/projects/Screenshot_2024-12-20_at_7.28.23_PM_puk8vi.png",
      alt: "YouTube To Blogs Preview Image",
    }],
  },
  icons: {
    shortcut: "https://res.cloudinary.com/diyxwdtjd/image/upload/v1734703785/projects/youtube-icon_winfxv.jpg",
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Analytics />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative min-h-screen">
            <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container flex items-center justify-end h-16">
                {/* <div className="flex items-center gap-2">
                  <YoutubeIcon className="h-6 w-6 text-red-500" />
                  <span className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
                    YT2Blog
                  </span>
                </div> */}
                <div className="flex items-center gap-6">
                  <nav className="flex items-center gap-6">
                    <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                      Home
                    </Link>
                    <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                      About
                    </Link>
                  </nav>
                  <div className="h-4 w-[1px] bg-border" />
                  <ThemeToggle />
                </div>
              </div>
            </header>
            {children}
          </div>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}