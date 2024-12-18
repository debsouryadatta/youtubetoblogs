'use client';

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
              Transform your favorite YouTube videos into well-structured, readable blog posts using the power of AI.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 w-full max-w-4xl">
            <div className="p-6 backdrop-blur-lg bg-white/50 dark:bg-white/5 rounded-lg border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
              <YoutubeIcon className="h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                YouTube Integration
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Simply paste any YouTube video URL and let our system extract the subtitles automatically.
              </p>
            </div>

            <div className="p-6 backdrop-blur-lg bg-white/50 dark:bg-white/5 rounded-lg border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
              <BrainCircuitIcon className="h-12 w-12 text-purple-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                AI-Powered Processing
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Advanced AI algorithms transform video subtitles into coherent, well-structured blog posts with proper formatting.
              </p>
            </div>

            <div className="p-6 backdrop-blur-lg bg-white/50 dark:bg-white/5 rounded-lg border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
              <BookOpenIcon className="h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Rich Content Support
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Generated blogs support Markdown, KaTeX math formulas, Mermaid diagrams, and more for comprehensive content.
              </p>
            </div>
          </div>

          <div className="space-y-8 max-w-4xl w-full backdrop-blur-lg bg-white/50 dark:bg-white/5 p-8 rounded-lg border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              How It Works
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">1. Select Your Video</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Copy and paste any YouTube video URL into our system. We support both standard youtube.com links and shortened youtu.be formats.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">2. AI Processing</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Our system extracts video subtitles and processes them using advanced AI models to generate well-structured, readable content.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">3. Rich Blog Post</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Get a beautifully formatted blog post with support for various content types including text, code blocks, mathematical formulas, and diagrams.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}