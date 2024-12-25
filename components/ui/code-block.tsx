"use client";

import { Copy } from "lucide-react";
import { Button } from "./button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  children: any;
  className?: string;
  node?: any;
}

export function CodeBlock({ children, className, node, ...props }: CodeBlockProps) {
  const getCodeContent = () => {
    // If code is directly available in node.children[0].value
    if (node?.children?.[0]?.value) {
      return node.children[0].value;
    }
    
    // If code is nested in children
    if (children?.props?.children) {
      if (typeof children.props.children === 'string') {
        return children.props.children;
      }
      // Handle array of children
      if (Array.isArray(children.props.children)) {
        return children.props.children.map((child: any) => 
          typeof child === 'string' ? child : child?.props?.children || ''
        ).join('');
      }
    }
    
    return '';
  };

  const copyToClipboard = async () => {
    try {
      const codeContent = getCodeContent();
      await navigator.clipboard.writeText(codeContent);
      toast.success("Code copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy code");
    }
  };

  return (
    <div className="relative group">
      <Button
        size="icon"
        variant="ghost"
        className="absolute right-2 top-2 hover:bg-muted-foreground/10"
        onClick={copyToClipboard}
      >
        <Copy className="h-4 w-4" />
      </Button>
      <pre className={cn(
        "whitespace-pre-wrap break-words overflow-x-auto rounded-lg p-4 bg-zinc-900",
        className
      )} {...props}>
        {children}
      </pre>
    </div>
  );
}
