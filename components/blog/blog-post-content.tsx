'use client';

import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import 'katex/dist/katex.css';
import mermaid from 'mermaid';
import { CodeBlock } from "@/components/ui/code-block";

interface BlogPostContentProps {
  content: string;
  fontStyle: string;
}

export function BlogPostContent({ content, fontStyle }: BlogPostContentProps) {
  const mermaidRef = useRef<HTMLElement>(null);
  console.log("fontStyle: ", fontStyle);
  

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
    <article className={`prose prose-neutral dark:prose-invert max-w-none [&_pre]:whitespace-pre-wrap [&_pre]:break-words [&_pre]:overflow-x-auto ${
      fontStyle === 'Roboto' ? 'font-Roboto' :
      fontStyle === 'Ubuntu' ? 'font-Ubuntu' :
      fontStyle === 'Outfit' ? 'font-Outfit' :
      fontStyle === 'Itim' ? 'font-Itim' : 'font-Roboto'
    }`} ref={mermaidRef}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeRaw]}
        className="prose prose-sm dark:prose-invert max-w-none"
        components={{
          p: ({ node, children, ...props }) => {
            const hasPre = (Array.isArray(children) 
              ? children.some((child: any) => child?.type === 'pre')
              : false);
            
            return hasPre ? <>{children}</> : <div {...props}>{children}</div>;
          },
          pre: ({ node, children, ...props }) => (
            <CodeBlock node={node} {...props}>{children}</CodeBlock>
          ),
          img: ({ node, ...props }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              {...props}
              className="rounded-lg shadow-md"
              alt={props.alt || ''}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
