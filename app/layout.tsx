import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'YouTube Subtitle Blog',
  description: 'Transform YouTube videos into beautiful blog posts',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
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
                    <a href="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                      Home
                    </a>
                    <a href="/about" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                      About
                    </a>
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