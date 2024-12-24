'use client';

import Footer from '@/components/footer';
import { BookOpenIcon, BrainCircuitIcon, YoutubeIcon } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:via-black dark:to-gray-800">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-gradient-to-b from-purple-100/30 to-cyan-100/30 dark:from-purple-900/20 dark:to-cyan-900/20 blur-3xl rounded-full" />
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-gradient-to-t from-blue-100/30 to-pink-100/30 dark:from-blue-900/20 dark:to-pink-900/20 blur-3xl rounded-full" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      <main className="container mx-auto px-4 py-12 relative">
        <div className="flex flex-col items-center justify-center space-y-16">
          <div className="space-y-6 text-center relative max-w-4xl">
            <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              About YouTube to Blogs
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              An AI-powered web application that transforms YouTube videos into well-structured, readable blog posts. Experience seamless content repurposing with our advanced features and user-friendly interface.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 w-full max-w-6xl">
            <div className="p-6 backdrop-blur-lg bg-white/50 dark:bg-white/5 rounded-lg border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
              <YoutubeIcon className="h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Versatile Video Support
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Convert any YouTube video or Short into a detailed blog post, supporting various content styles with intelligent subtitle extraction.
              </p>
            </div>

            <div className="p-6 backdrop-blur-lg bg-white/50 dark:bg-white/5 rounded-lg border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
              <BrainCircuitIcon className="h-12 w-12 text-purple-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                AI-Powered Conversion
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Utilizing advanced AI technology with secure rate limiting for intelligent content formatting and structure.
              </p>
            </div>

            <div className="p-6 backdrop-blur-lg bg-white/50 dark:bg-white/5 rounded-lg border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
              <BookOpenIcon className="h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Export & Storage
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Export your blog posts as PDF or markdown files with code wrap support. Import and export data from localStorage as JSON for backup.
              </p>
            </div>
          </div>

          <div className="max-w-4xl space-y-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
              Additional Features
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="p-6 backdrop-blur-lg bg-white/50 dark:bg-white/5 rounded-lg border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Interactive Features</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Engage with your blog content through an interactive chat interface, customize fonts, and organize posts with categories.
                </p>
              </div>
              <div className="p-6 backdrop-blur-lg bg-white/50 dark:bg-white/5 rounded-lg border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Responsive Design</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Enjoy a seamless experience across all devices with our mobile-friendly, responsive interface.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center max-w-3xl">
            <p className="text-gray-600 dark:text-gray-300 mb-20">
              Built with modern technologies including Next.js, TypeScript, Tailwind CSS, and Shadcn UI. Deployed with Docker and maintained with CI/CD practices.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
