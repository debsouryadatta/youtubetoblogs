'use client';

import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import 'katex/dist/katex.css';
import mermaid from 'mermaid';

interface BlogPostContentProps {
  content: string;
}

export function BlogPostContent({ content }: BlogPostContentProps) {
  const mermaidRef = useRef<HTMLElement>(null);

  useEffect(() => {
    mermaid.initialize({ startOnLoad: false });

    const renderMermaid = async () => {
      if (mermaidRef.current) {
        const mermaidElements = Array.from(
          mermaidRef.current.querySelectorAll('pre code.language-mermaid')
        );

        for (const element of mermaidElements) {
          try {
            const graphDefinition = element.textContent || '';
            const svg = await mermaid.render(
              `mermaid-${Math.random().toString(36).substring(2, 15)}`,
              graphDefinition
            );
            const div = document.createElement('div');
            div.innerHTML = svg.svg;
            element.parentNode?.replaceChild(div, element.parentNode.firstChild!);
          } catch (error) {
            console.error('Error rendering mermaid diagram:', error);
          }
        }
      }
    };

    renderMermaid();
  }, []);

  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none" ref={mermaidRef}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeRaw]}
        components={{
          img: ({ node, ...props }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              {...props}
              className="rounded-lg shadow-md"
              alt={props.alt || ''}
            />
          ),
          code: ({ node, className, children, ...props }) => (
            <pre className="bg-muted rounded-lg overflow-x-auto text-black dark:text-white ">
              <code
                className={`${className} block pr-4`}
                {...props}
              >
                {children}
              </code>
            </pre>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
