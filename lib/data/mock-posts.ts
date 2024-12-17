import type { BlogPost } from '../types';

export const mockPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Complete Markdown Showcase',
    content: `# Complete Markdown Showcase

## Text Formatting

This is a paragraph with **bold text**, *italic text*, and ~~strikethrough~~. You can also use inline \`code\` formatting.

## Lists

### Unordered List
- First item
- Second item
  - Nested item 1
  - Nested item 2
- Third item

### Ordered List
1. First step
2. Second step
   1. Sub-step A
   2. Sub-step B
3. Third step

## Code Blocks

\`\`\`javascript
// Example JavaScript code
function calculateFactorial(n) {
  if (n === 0 || n === 1) return 1;
  return n * calculateFactorial(n - 1);
}

console.log(calculateFactorial(5)); // Output: 120
\`\`\`

## Blockquotes

> This is a blockquote. It can contain multiple paragraphs.
>
> Second paragraph in the blockquote.
>> Nested blockquote

## Tables

| Feature | Description | Support |
|---------|-------------|---------|
| Tables | Format data in columns | ✅ |
| Lists | Ordered and unordered | ✅ |
| Code | Syntax highlighting | ✅ |

## Links and Images

[Visit OpenAI](https://openai.com)

![Beautiful Nature](https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1200)

## Task Lists

- [x] Write documentation
- [x] Add code examples
- [ ] Review content
- [ ] Publish

## Mathematical Expressions

When \`a ≠ 0\`, there are two solutions to \`ax² + bx + c = 0\`:

\`x = (-b ± √(b² - 4ac)) / (2a)\`

## Diagrams (if supported)

\`\`\`mermaid
graph TD
    A[Start] --> B{Is it working?}
    B -- Yes --> C[Great!]
    B -- No --> D[Debug]
    D --> B
\`\`\`

## Horizontal Rule

---

## Custom HTML (if supported)

<details>
<summary>Click to expand</summary>
This is hidden content that can be expanded.
</details>

<div align="center">
  <h3>Centered Content</h3>
  <p>This content is centered using HTML attributes.</p>
</div>`,
    youtubeUrl: 'https://youtube.com/watch?v=0l4hoQlyslw',
    createdAt: '2024-03-21',
  },
  // ... (keep other existing mock posts)
];