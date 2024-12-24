import React from 'react'
import { Star } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="absolute bottom-0 left-0 right-0 py-4 backdrop-blur-md bg-white/30 dark:bg-black/30">
            <Link target='_blank' href="https://github.com/debsouryadatta/youtubetoblogs" className="container mx-auto flex justify-center items-center space-x-2 hover:text-gray-900 dark:hover:text-white cursor-pointer hover:animate-pulse">
                <Star className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">Give it a star on</span>
                <div
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-200"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="inline-block"
                    >
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                    </svg>
                </div>
            </Link>
        </footer>
    )
}
