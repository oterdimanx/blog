export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  publishedAt: string;
  readingTime: number;
  tags: string[];
  category: string;
  coverImage?: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Getting Started with React and TypeScript",
    excerpt: "Learn how to build modern web applications using React with TypeScript for better type safety and developer experience.",
    content: `
# Getting Started with React and TypeScript

TypeScript has become an essential tool in modern React development. In this comprehensive guide, we'll explore how to leverage TypeScript's powerful type system to build more robust React applications.

## Why TypeScript with React?

TypeScript provides several key benefits when working with React:

- **Type Safety**: Catch errors at compile time rather than runtime
- **Better IntelliSense**: Enhanced autocomplete and documentation
- **Refactoring Confidence**: Make changes with confidence
- **Self-Documenting Code**: Types serve as documentation

## Setting Up Your Project

The easiest way to get started is using Vite with the React TypeScript template:

\`\`\`bash
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
npm run dev
\`\`\`

## Creating Your First Typed Component

Here's a simple example of a typed React component:

\`\`\`typescript
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ label, onClick, variant = 'primary' }) => {
  return (
    <button onClick={onClick} className={\`btn btn-\${variant}\`}>
      {label}
    </button>
  );
};
\`\`\`

## Best Practices

1. Always define prop types using interfaces or types
2. Use React.FC sparingly - prefer explicit typing
3. Leverage union types for variants
4. Keep types close to where they're used

Start building with TypeScript today and enjoy the benefits of a more maintainable codebase!
    `,
    author: {
      name: "Sarah Johnson",
      avatar: "SJ"
    },
    publishedAt: "2024-03-15",
    readingTime: 8,
    tags: ["React", "TypeScript", "Web Development"],
    category: "Development"
  },
  {
    id: "2",
    title: "The Art of CSS Grid and Flexbox",
    excerpt: "Master modern CSS layout techniques to create responsive and beautiful user interfaces with ease.",
    content: `
# The Art of CSS Grid and Flexbox

Modern CSS provides powerful layout systems that make creating responsive designs easier than ever. Let's dive into Grid and Flexbox.

## Understanding Flexbox

Flexbox is perfect for one-dimensional layouts:

\`\`\`css
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}
\`\`\`

## Mastering CSS Grid

Grid excels at two-dimensional layouts:

\`\`\`css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}
\`\`\`

## When to Use Which?

- Use **Flexbox** for: navigation bars, button groups, single-row/column layouts
- Use **Grid** for: page layouts, card grids, complex multi-dimensional designs

## Combining Both

The real power comes from combining these tools. Use Grid for the overall page structure and Flexbox for component internals.

Practice these techniques and you'll be creating stunning layouts in no time!
    `,
    author: {
      name: "Mike Chen",
      avatar: "MC"
    },
    publishedAt: "2024-03-12",
    readingTime: 6,
    tags: ["CSS", "Design", "Layout"],
    category: "Design"
  },
  {
    id: "3",
    title: "Building Scalable APIs with Node.js",
    excerpt: "Explore best practices for designing and implementing RESTful APIs that can handle growth.",
    content: `
# Building Scalable APIs with Node.js

Creating APIs that can scale is crucial for modern applications. Let's explore the key principles and practices.

## API Design Principles

Good API design starts with clear, consistent endpoints:

\`\`\`
GET    /api/posts
POST   /api/posts
GET    /api/posts/:id
PUT    /api/posts/:id
DELETE /api/posts/:id
\`\`\`

## Error Handling

Consistent error responses are essential:

\`\`\`javascript
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "The requested post does not exist",
    "statusCode": 404
  }
}
\`\`\`

## Performance Optimization

- Implement caching strategies
- Use database indexing
- Paginate large result sets
- Compress responses

## Security Best Practices

1. Always validate input
2. Use rate limiting
3. Implement proper authentication
4. Sanitize user data

Build your APIs with these principles in mind for long-term success!
    `,
    author: {
      name: "Alex Rivera",
      avatar: "AR"
    },
    publishedAt: "2024-03-10",
    readingTime: 10,
    tags: ["Node.js", "API", "Backend"],
    category: "Backend"
  },
  {
    id: "4",
    title: "Mastering Tailwind CSS",
    excerpt: "Discover how utility-first CSS can revolutionize your development workflow and make styling faster.",
    content: `
# Mastering Tailwind CSS

Tailwind CSS has transformed how we approach styling in modern web development. Let's explore why it's so powerful.

## The Utility-First Philosophy

Instead of writing custom CSS, compose utilities:

\`\`\`html
<div class="flex items-center justify-between p-4 bg-primary text-primary-foreground rounded-lg">
  <h2 class="text-2xl font-bold">Hello World</h2>
  <button class="px-4 py-2 bg-accent rounded">Click me</button>
</div>
\`\`\`

## Customization

Tailwind is highly customizable through your config:

\`\`\`javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#...',
          DEFAULT: '#...',
          dark: '#...'
        }
      }
    }
  }
}
\`\`\`

## Best Practices

1. Use @apply for repeated patterns
2. Create component classes for complex elements
3. Leverage the JIT compiler
4. Keep your config organized

## Responsive Design

Mobile-first responsive design is built-in:

\`\`\`html
<div class="text-sm md:text-base lg:text-lg">
  Responsive text
</div>
\`\`\`

Embrace the utility-first approach and watch your productivity soar!
    `,
    author: {
      name: "Emily Wong",
      avatar: "EW"
    },
    publishedAt: "2024-03-08",
    readingTime: 7,
    tags: ["CSS", "Tailwind", "Design"],
    category: "Design"
  },
  {
    id: "5",
    title: "Introduction to Web Accessibility",
    excerpt: "Learn why accessibility matters and how to make your websites usable for everyone.",
    content: `
# Introduction to Web Accessibility

Building accessible websites isn't just good practice—it's essential for reaching all users.

## Why Accessibility Matters

- **Inclusive Design**: Ensure everyone can use your site
- **Legal Requirements**: Many countries mandate accessibility
- **Better UX**: Accessible sites are better for everyone
- **SEO Benefits**: Proper semantics help search engines

## Key Principles (WCAG)

1. **Perceivable**: Information must be presentable
2. **Operable**: UI must be navigable
3. **Understandable**: Content must be clear
4. **Robust**: Work with assistive technologies

## Quick Wins

\`\`\`html
<!-- Use semantic HTML -->
<nav>
  <ul>
    <li><a href="/">Home</a></li>
  </ul>
</nav>

<!-- Add alt text -->
<img src="logo.png" alt="Company logo" />

<!-- Label form inputs -->
<label for="email">Email</label>
<input id="email" type="email" />
\`\`\`

## Testing Tools

- Use keyboard-only navigation
- Test with screen readers
- Check color contrast
- Validate HTML

Making your site accessible benefits everyone. Start implementing these practices today!
    `,
    author: {
      name: "David Park",
      avatar: "DP"
    },
    publishedAt: "2024-03-05",
    readingTime: 9,
    tags: ["Accessibility", "Web Development", "UX"],
    category: "Development"
  },
  {
    id: "6",
    title: "State Management in Modern React",
    excerpt: "Compare different state management solutions and learn when to use each approach.",
    content: `
# State Management in Modern React

Choosing the right state management solution can make or break your React application.

## Built-in Solutions

React provides powerful built-in hooks:

\`\`\`typescript
// useState for local state
const [count, setCount] = useState(0);

// useReducer for complex state
const [state, dispatch] = useReducer(reducer, initialState);

// useContext for shared state
const theme = useContext(ThemeContext);
\`\`\`

## When to Use External Libraries

Consider libraries like Zustand or Redux when:
- State is shared across many components
- You need middleware (logging, persistence)
- Complex state updates require time-travel debugging

## Server State vs Client State

Don't mix them up:
- **Server State**: Data from APIs (use TanStack Query)
- **Client State**: UI state, form data (use React hooks)

## Best Practices

1. Keep state as local as possible
2. Lift state only when necessary
3. Use composition over prop drilling
4. Consider server state management tools

Choose the right tool for your specific needs!
    `,
    author: {
      name: "Sarah Johnson",
      avatar: "SJ"
    },
    publishedAt: "2024-03-01",
    readingTime: 8,
    tags: ["React", "State Management", "Architecture"],
    category: "Development"
  }
];
