# Recall App Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a PWA for managing projects and wikis from Google Sheets with Claude.ai integration.

**Architecture:** React app with TanStack Query for data fetching, SheetsDbClient for API communication, and voget-io's tech theme. Two modes (View/Edit) with tab navigation, filtering, and Claude.ai prompt generation.

**Tech Stack:** React, TypeScript, Vite, Tailwind CSS, TanStack Query, vite-plugin-pwa

---

## Task 1: Project Initialization

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `.gitignore`
- Create: `index.html`

**Step 1: Initialize git repository**

```bash
git init
```

**Step 2: Create package.json**

```json
{
  "name": "recall-app",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-label": "^2.1.8",
    "@radix-ui/react-select": "^2.2.6",
    "@radix-ui/react-slot": "^1.2.4",
    "@radix-ui/react-tabs": "^1.1.13",
    "@radix-ui/react-toast": "^1.2.15",
    "@tanstack/react-query": "^5.62.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^0.468.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.28.0",
    "tailwind-merge": "^2.6.0",
    "uuid": "^13.0.0",
    "vite-plugin-pwa": "^1.2.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.1.0",
    "@testing-library/user-event": "^14.5.2",
    "@types/node": "^22.10.0",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@types/uuid": "^10.0.0",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "jsdom": "^25.0.1",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.16",
    "typescript": "~5.6.2",
    "vite": "^6.0.3",
    "vitest": "^3.2.4"
  }
}
```

**Step 3: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"]
}
```

**Step 4: Create vite.config.ts**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [{
          urlPattern: /^https:\/\/sheetsapi.*$/,
          handler: 'NetworkOnly',
        }]
      },
      manifest: {
        name: 'Recall',
        short_name: 'Recall',
        description: 'Project and Wiki management with Claude.ai integration',
        theme_color: '#00d4ff',
        background_color: '#0a0e14',
        display: 'standalone',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
```

**Step 5: Create .gitignore**

```
node_modules
dist
.DS_Store
*.local
.env
```

**Step 6: Create index.html**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Recall</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

**Step 7: Install dependencies**

Run: `npm install`
Expected: Dependencies installed successfully

**Step 8: Commit**

```bash
git add .
git commit -m "chore: initialize project with dependencies and config"
```

---

## Task 2: Tailwind Configuration

**Files:**
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `src/index.css`

**Step 1: Create tailwind.config.js**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
}
```

**Step 2: Create postcss.config.js**

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

**Step 3: Create src/index.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Tech dark theme */
    --bg-primary: #0a0e14;
    --bg-secondary: #121821;
    --accent-cyan: #00d4ff;
    --accent-purple: #a78bfa;
    --accent-pink: #ec4899;
    --grid-color: rgba(100, 150, 255, 0.08);
    --particle-color: rgba(167, 139, 250, 0.4);

    --background: 220 50% 4%;
    --foreground: 210 40% 98%;
    --card: 220 40% 7%;
    --card-foreground: 210 40% 98%;
    --primary: 190 100% 50%;
    --primary-foreground: 220 50% 4%;
    --secondary: 220 30% 14%;
    --secondary-foreground: 210 40% 98%;
    --muted: 220 30% 14%;
    --muted-foreground: 215 20% 65%;
    --accent: 263 70% 76%;
    --accent-foreground: 220 50% 4%;
    --border: 220 30% 18%;
    --input: 220 30% 14%;
    --ring: 190 100% 50%;
    --radius: 0.75rem;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground antialiased;
    font-family: 'JetBrains Mono', monospace;
    overflow-x: hidden;
  }
}

/* Animated gradient backdrop */
.gradient-backdrop {
  position: fixed;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle at 20% 50%,
    rgba(0, 212, 255, 0.08) 0%,
    transparent 50%
  ),
  radial-gradient(
    circle at 80% 50%,
    rgba(167, 139, 250, 0.06) 0%,
    transparent 50%
  ),
  radial-gradient(
    circle at 50% 50%,
    rgba(236, 72, 153, 0.04) 0%,
    transparent 50%
  );
  animation: gradientShift 20s ease-in-out infinite;
  z-index: 0;
  pointer-events: none;
}

@keyframes gradientShift {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  33% {
    transform: translate(5%, -5%) rotate(120deg);
  }
  66% {
    transform: translate(-5%, 5%) rotate(240deg);
  }
}

/* Animated grid */
.grid-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    linear-gradient(var(--grid-color) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-color) 1px, transparent 1px);
  background-size: 60px 60px;
  background-position: 0 0, 0 0;
  animation: gridMove 40s linear infinite;
  z-index: 0;
  opacity: 0.6;
  pointer-events: none;
}

@keyframes gridMove {
  0% {
    background-position: 0 0, 0 0;
  }
  100% {
    background-position: 60px 60px, 60px 60px;
  }
}

/* Particle system */
.particles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 2px;
  height: 2px;
  background: var(--particle-color);
  border-radius: 50%;
  box-shadow: 0 0 8px var(--particle-color);
  animation: particleFloat linear infinite;
}

@keyframes particleFloat {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh) translateX(var(--particle-drift, 0));
    opacity: 0;
  }
}

/* Scanline effect */
.scanline {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(0, 212, 255, 0.15),
    transparent
  );
  animation: scan 8s linear infinite;
  z-index: 1;
  pointer-events: none;
}

@keyframes scan {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(100vh);
  }
}

/* Corner accents */
.corner-accent {
  position: fixed;
  width: 200px;
  height: 200px;
  pointer-events: none;
  z-index: 1;
}

.corner-accent.top-left {
  top: 0;
  left: 0;
  border-top: 1px solid rgba(0, 212, 255, 0.2);
  border-left: 1px solid rgba(0, 212, 255, 0.2);
  animation: cornerPulse 4s ease-in-out infinite;
}

.corner-accent.bottom-right {
  bottom: 0;
  right: 0;
  border-bottom: 1px solid rgba(167, 139, 250, 0.2);
  border-right: 1px solid rgba(167, 139, 250, 0.2);
  animation: cornerPulse 4s ease-in-out infinite 2s;
}

@keyframes cornerPulse {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.8;
  }
}

/* Tech card styling */
.tech-card {
  background: rgba(18, 24, 33, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(100, 150, 255, 0.2);
  box-shadow:
    0 0 40px rgba(0, 212, 255, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
}

.tech-card:hover {
  border-color: rgba(167, 139, 250, 0.4);
  box-shadow:
    0 0 60px rgba(167, 139, 250, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

/* Glow text effects */
.glow-cyan {
  color: var(--accent-cyan);
  text-shadow: 0 0 30px rgba(0, 212, 255, 0.3);
}

.glow-purple {
  color: var(--accent-purple);
  text-shadow: 0 0 30px rgba(167, 139, 250, 0.3);
}

/* Tech badge */
.tech-badge {
  background: rgba(0, 212, 255, 0.1);
  border: 1px solid rgba(0, 212, 255, 0.2);
  color: var(--accent-cyan);
}
```

**Step 4: Commit**

```bash
git add .
git commit -m "style: add tailwind config and voget-io theme"
```

---

## Task 3: Base UI Components

**Files:**
- Create: `src/lib/utils.ts`
- Create: `src/components/ui/button.tsx`
- Create: `src/components/ui/card.tsx`
- Create: `src/components/ui/input.tsx`
- Create: `src/components/ui/dialog.tsx`
- Create: `src/components/ui/tabs.tsx`

**Step 1: Create src/lib/utils.ts**

```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**Step 2: Create src/components/ui/button.tsx**

```typescript
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

**Step 3: Create src/components/ui/card.tsx**

```typescript
import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
```

**Step 4: Create src/components/ui/input.tsx**

```typescript
import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
```

**Step 5: Create src/components/ui/dialog.tsx**

```typescript
import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-lg",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
}
```

**Step 6: Create src/components/ui/tabs.tsx**

```typescript
import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
      className
    )}
    ref={ref}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
```

**Step 7: Commit**

```bash
git add .
git commit -m "feat: add base UI components"
```

---

## Task 4: Data Types and Constants

**Files:**
- Create: `src/lib/types.ts`
- Create: `src/config/constants.ts`

**Step 1: Create src/lib/types.ts**

```typescript
export interface Project {
  id: string
  projectName: string
  type: string
  status: string
  folderId: string
  primaryTags: string
  readmeDocId: string
  briefDescription: string
  dateCreated: string
  lastUpdated: string
}

export interface Wiki {
  id: string
  topic: string
  folderId: string
  primaryTags: string
  readmeDocId: string
  briefDescription: string
  dateCreated: string
  lastUpdated: string
}

export interface Settings {
  spreadsheetId: string
  lastValidated: string
}

export type ItemType = 'project' | 'wiki'

export interface FilterState {
  search: string
  tags: string[]
  type: string
  status: string
}
```

**Step 2: Create src/config/constants.ts**

```typescript
export const SHEETS_DB_API_URL = 'https://sheetsapi-g56q77hy2a-uc.a.run.app'
export const SERVICE_ACCOUNT_EMAIL = 'sheets-db@sheets-db-438616.iam.gserviceaccount.com'

export const EXPECTED_PROJECT_COLUMNS = [
  'id', 'projectName', 'type', 'status', 'folderId',
  'primaryTags', 'readmeDocId', 'briefDescription',
  'dateCreated', 'lastUpdated'
]

export const EXPECTED_WIKI_COLUMNS = [
  'id', 'topic', 'folderId', 'primaryTags',
  'readmeDocId', 'briefDescription', 'dateCreated', 'lastUpdated'
]

export const PROJECTS_SHEET_NAME = 'projects'
export const WIKIS_SHEET_NAME = 'wikis'
```

**Step 3: Commit**

```bash
git add .
git commit -m "feat: add data types and constants"
```

---

## Task 5: SheetsDB Client

**Files:**
- Create: `src/services/sheetsdb/SheetsDbError.ts`
- Create: `src/services/sheetsdb/SheetsDbClient.ts`
- Create: `src/services/sheetsdb/index.ts`

**Step 1: Create src/services/sheetsdb/SheetsDbError.ts**

```typescript
export class SheetsDbError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: unknown
  ) {
    super(message)
    this.name = 'SheetsDbError'
  }
}
```

**Step 2: Create src/services/sheetsdb/SheetsDbClient.ts**

```typescript
import { SheetsDbError } from './SheetsDbError'

interface SheetsDbClientOptions {
  baseUrl: string
  spreadsheetId: string
}

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>
}

export interface SheetInfo {
  sheetId: number
  title: string
  index: number
}

export class SheetsDbClient {
  private baseUrl: string
  private spreadsheetId: string

  constructor(options: SheetsDbClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, '')
    this.spreadsheetId = options.spreadsheetId
  }

  private async request<T>(path: string, options: RequestOptions = {}): Promise<T | undefined> {
    const url = `${this.baseUrl}${path}`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Spreadsheet-Id': this.spreadsheetId,
      ...options.headers,
    }

    const response = await fetch(url, { ...options, headers })

    if (!response.ok) {
      let errorData: { error?: string } | string
      try {
        errorData = await response.json()
      } catch {
        errorData = await response.text()
      }
      const message =
        typeof errorData === 'object' && errorData?.error
          ? errorData.error
          : `Request failed with status ${response.status}`
      throw new SheetsDbError(message, response.status, errorData)
    }

    if (response.status === 204) return undefined
    return response.json()
  }

  async health(): Promise<{ status: string }> {
    const response = await fetch(`${this.baseUrl}/health`)
    return response.json()
  }

  async listSheets(): Promise<SheetInfo[]> {
    const result = await this.request<{ sheets: SheetInfo[] }>('/sheets')
    return result?.sheets || []
  }

  async getRows<T>(sheetName: string): Promise<T[]> {
    const result = await this.request<{ rows: T[] }>(`/sheets/${encodeURIComponent(sheetName)}/rows`)
    return result?.rows || []
  }

  async createRow<T>(sheetName: string, data: T): Promise<{ rowIndex: number }> {
    const result = await this.request<{ rowIndex: number }>(
      `/sheets/${encodeURIComponent(sheetName)}/rows`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    )
    return result!
  }

  async updateRow<T>(sheetName: string, rowIndex: number, data: T): Promise<void> {
    await this.request<void>(`/sheets/${encodeURIComponent(sheetName)}/rows/${rowIndex}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteRow(sheetName: string, rowIndex: number): Promise<void> {
    await this.request(`/sheets/${encodeURIComponent(sheetName)}/rows/${rowIndex}`, {
      method: 'DELETE',
    })
  }
}
```

**Step 3: Create src/services/sheetsdb/index.ts**

```typescript
export { SheetsDbClient } from './SheetsDbClient'
export { SheetsDbError } from './SheetsDbError'
export type { SheetInfo } from './SheetsDbClient'
```

**Step 4: Commit**

```bash
git add .
git commit -m "feat: add SheetsDB client"
```

---

## Task 6: Settings Hook and Storage

**Files:**
- Create: `src/hooks/use-settings.ts`

**Step 1: Create src/hooks/use-settings.ts**

```typescript
import { useState, useEffect } from 'react'
import { SheetsDbClient } from '@/services/sheetsdb'
import { SHEETS_DB_API_URL, PROJECTS_SHEET_NAME, WIKIS_SHEET_NAME } from '@/config/constants'
import type { Settings } from '@/lib/types'

const SETTINGS_KEY = 'recall-settings'

export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(() => {
    const stored = localStorage.getItem(SETTINGS_KEY)
    return stored ? JSON.parse(stored) : null
  })
  const [isInitializing, setIsInitializing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const spreadsheetId = settings?.spreadsheetId || null

  const connectSpreadsheet = async (id: string) => {
    setIsInitializing(true)
    setError(null)

    try {
      // Create client
      const client = new SheetsDbClient({
        baseUrl: SHEETS_DB_API_URL,
        spreadsheetId: id,
      })

      // Validate connection
      await client.health()

      // Validate sheets exist
      const sheets = await client.listSheets()
      const hasProjects = sheets.some(s => s.title === PROJECTS_SHEET_NAME)
      const hasWikis = sheets.some(s => s.title === WIKIS_SHEET_NAME)

      if (!hasProjects || !hasWikis) {
        throw new Error(`Missing required sheets. Found: ${sheets.map(s => s.title).join(', ')}`)
      }

      // Save settings
      const newSettings: Settings = {
        spreadsheetId: id,
        lastValidated: new Date().toISOString(),
      }
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings))
      setSettings(newSettings)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to connect'
      setError(message)
      throw err
    } finally {
      setIsInitializing(false)
    }
  }

  const disconnect = () => {
    localStorage.removeItem(SETTINGS_KEY)
    setSettings(null)
  }

  return {
    spreadsheetId,
    settings,
    isInitializing,
    error,
    connectSpreadsheet,
    disconnect,
  }
}
```

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add settings hook with validation"
```

---

## Task 7: Setup Wizard Component

**Files:**
- Create: `src/components/sheets/SheetsSetupWizard.tsx`
- Create: `src/components/sheets/index.ts`

**Step 1: Create src/components/sheets/SheetsSetupWizard.tsx**

```typescript
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface SheetsSetupWizardProps {
  serviceAccountEmail: string
  inputValue: string
  onInputChange: (value: string) => void
  onConnect: () => Promise<void>
  isConnecting?: boolean
  error?: string | null
}

export function SheetsSetupWizard({
  serviceAccountEmail,
  inputValue,
  onInputChange,
  onConnect,
  isConnecting = false,
  error,
}: SheetsSetupWizardProps) {
  const handleConnect = async () => {
    await onConnect()
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight mb-2">
          <span className="glow-cyan">Recall</span>
        </h1>
        <p className="text-muted-foreground">Connect your Google Sheet to get started</p>
      </div>

      <div className="tech-card p-6 rounded-xl">
        <ol className="list-decimal list-inside space-y-3 text-sm mb-6">
          <li>Open your Google Sheet with "projects" and "wikis" tabs</li>
          <li>
            Share it with:
            <code className="block mt-2 p-3 bg-secondary rounded text-xs break-all select-all">
              {serviceAccountEmail}
            </code>
            <span className="text-muted-foreground text-xs">(Editor access required)</span>
          </li>
          <li>Copy the Sheet ID from the URL</li>
          <li>Paste below and click Connect</li>
        </ol>

        <div className="space-y-3">
          <Input
            type="text"
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="Paste your Google Sheet ID here"
            className="w-full"
          />
          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}
          <Button
            onClick={handleConnect}
            disabled={!inputValue || isConnecting}
            className="w-full"
          >
            {isConnecting ? 'Connecting...' : 'Connect'}
          </Button>
        </div>
      </div>
    </div>
  )
}
```

**Step 2: Create src/components/sheets/index.ts**

```typescript
export { SheetsSetupWizard } from './SheetsSetupWizard'
```

**Step 3: Commit**

```bash
git add .
git commit -m "feat: add sheets setup wizard"
```

---

## Task 8: Background Component

**Files:**
- Create: `src/components/layout/Background.tsx`

**Step 1: Create src/components/layout/Background.tsx**

```typescript
import { useEffect } from 'react'

function Particles() {
  useEffect(() => {
    const container = document.getElementById('particles')
    if (!container || container.children.length > 0) return

    const particleCount = 30
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div')
      particle.className = 'particle'
      particle.style.left = Math.random() * 100 + '%'
      particle.style.top = Math.random() * 100 + '%'
      const duration = 15 + Math.random() * 25
      particle.style.animationDuration = duration + 's'
      particle.style.animationDelay = Math.random() * 10 + 's'
      const drift = (Math.random() - 0.5) * 100
      particle.style.setProperty('--particle-drift', drift + 'px')
      const size = 1 + Math.random() * 2
      particle.style.width = size + 'px'
      particle.style.height = size + 'px'
      container.appendChild(particle)
    }
  }, [])

  return <div className="particles" id="particles" />
}

export function Background() {
  return (
    <>
      <div className="gradient-backdrop" />
      <div className="grid-overlay" />
      <Particles />
      <div className="scanline" />
      <div className="corner-accent top-left" />
      <div className="corner-accent bottom-right" />
    </>
  )
}
```

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add background visual effects"
```

---

## Task 9: Data Fetching Hooks

**Files:**
- Create: `src/hooks/use-projects.ts`
- Create: `src/hooks/use-wikis.ts`

**Step 1: Create src/hooks/use-projects.ts**

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { SheetsDbClient } from '@/services/sheetsdb'
import { SHEETS_DB_API_URL, PROJECTS_SHEET_NAME } from '@/config/constants'
import type { Project } from '@/lib/types'
import { v4 as uuidv4 } from 'uuid'

export function useProjects(spreadsheetId: string | null) {
  const queryClient = useQueryClient()

  const client = spreadsheetId
    ? new SheetsDbClient({
        baseUrl: SHEETS_DB_API_URL,
        spreadsheetId,
      })
    : null

  const query = useQuery({
    queryKey: ['projects', spreadsheetId],
    queryFn: async () => {
      if (!client) throw new Error('No client')
      return client.getRows<Project>(PROJECTS_SHEET_NAME)
    },
    enabled: !!client,
  })

  const createMutation = useMutation({
    mutationFn: async (data: Omit<Project, 'id' | 'dateCreated' | 'lastUpdated'>) => {
      if (!client) throw new Error('No client')
      const now = new Date().toISOString()
      const project: Project = {
        ...data,
        id: uuidv4(),
        dateCreated: now,
        lastUpdated: now,
      }
      await client.createRow(PROJECTS_SHEET_NAME, project)
      return project
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', spreadsheetId] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({ rowIndex, data }: { rowIndex: number; data: Project }) => {
      if (!client) throw new Error('No client')
      const updated = {
        ...data,
        lastUpdated: new Date().toISOString(),
      }
      await client.updateRow(PROJECTS_SHEET_NAME, rowIndex, updated)
      return updated
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', spreadsheetId] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (rowIndex: number) => {
      if (!client) throw new Error('No client')
      await client.deleteRow(PROJECTS_SHEET_NAME, rowIndex)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', spreadsheetId] })
    },
  })

  return {
    projects: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    createProject: createMutation.mutateAsync,
    updateProject: updateMutation.mutateAsync,
    deleteProject: deleteMutation.mutateAsync,
  }
}
```

**Step 2: Create src/hooks/use-wikis.ts**

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { SheetsDbClient } from '@/services/sheetsdb'
import { SHEETS_DB_API_URL, WIKIS_SHEET_NAME } from '@/config/constants'
import type { Wiki } from '@/lib/types'
import { v4 as uuidv4 } from 'uuid'

export function useWikis(spreadsheetId: string | null) {
  const queryClient = useQueryClient()

  const client = spreadsheetId
    ? new SheetsDbClient({
        baseUrl: SHEETS_DB_API_URL,
        spreadsheetId,
      })
    : null

  const query = useQuery({
    queryKey: ['wikis', spreadsheetId],
    queryFn: async () => {
      if (!client) throw new Error('No client')
      return client.getRows<Wiki>(WIKIS_SHEET_NAME)
    },
    enabled: !!client,
  })

  const createMutation = useMutation({
    mutationFn: async (data: Omit<Wiki, 'id' | 'dateCreated' | 'lastUpdated'>) => {
      if (!client) throw new Error('No client')
      const now = new Date().toISOString()
      const wiki: Wiki = {
        ...data,
        id: uuidv4(),
        dateCreated: now,
        lastUpdated: now,
      }
      await client.createRow(WIKIS_SHEET_NAME, wiki)
      return wiki
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wikis', spreadsheetId] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({ rowIndex, data }: { rowIndex: number; data: Wiki }) => {
      if (!client) throw new Error('No client')
      const updated = {
        ...data,
        lastUpdated: new Date().toISOString(),
      }
      await client.updateRow(WIKIS_SHEET_NAME, rowIndex, updated)
      return updated
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wikis', spreadsheetId] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (rowIndex: number) => {
      if (!client) throw new Error('No client')
      await client.deleteRow(WIKIS_SHEET_NAME, rowIndex)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wikis', spreadsheetId] })
    },
  })

  return {
    wikis: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    createWiki: createMutation.mutateAsync,
    updateWiki: updateMutation.mutateAsync,
    deleteWiki: deleteMutation.mutateAsync,
  }
}
```

**Step 3: Commit**

```bash
git add .
git commit -m "feat: add data fetching hooks for projects and wikis"
```

---

## Task 10: Claude.ai Integration Utilities

**Files:**
- Create: `src/lib/claude.ts`
- Create: `src/lib/links.ts`

**Step 1: Create src/lib/claude.ts**

```typescript
import type { Project, Wiki } from './types'

function parseTags(tags: string): string[] {
  return tags.split(',').map(t => t.trim()).filter(Boolean)
}

export function generateClaudePrompt(item: Project | Wiki): string {
  const isProject = 'projectName' in item
  const name = isProject ? item.projectName : item.topic
  const tags = parseTags(item.primaryTags)

  return `Please read the README document with ID: ${item.readmeDocId}

Then recall any notes associated with these tags: ${tags.join(', ')}

Context:
- ${isProject ? 'Project' : 'Wiki'}: ${name}
- Description: ${item.briefDescription}
${isProject ? `- Type: ${(item as Project).type}\n- Status: ${(item as Project).status}` : ''}

Please provide a summary of what you found.`
}

export function launchClaude(item: Project | Wiki) {
  const prompt = generateClaudePrompt(item)
  const encodedPrompt = encodeURIComponent(prompt)
  const claudeUrl = `https://claude.ai/new?q=${encodedPrompt}`
  window.open(claudeUrl, '_blank', 'noopener,noreferrer')
}
```

**Step 2: Create src/lib/links.ts**

```typescript
export function getFolderUrl(folderId: string): string {
  return `https://drive.google.com/drive/folders/${folderId}`
}

export function getDocUrl(docId: string): string {
  return `https://docs.google.com/document/d/${docId}`
}
```

**Step 3: Commit**

```bash
git add .
git commit -m "feat: add Claude.ai integration and Google Drive link utilities"
```

---

## Task 11: View Mode - Project Card Component

**Files:**
- Create: `src/components/view-mode/ProjectCard.tsx`

**Step 1: Create src/components/view-mode/ProjectCard.tsx**

```typescript
import { ExternalLink, Folder, FileText } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Project } from '@/lib/types'
import { launchClaude } from '@/lib/claude'
import { getFolderUrl, getDocUrl } from '@/lib/links'

interface ProjectCardProps {
  project: Project
}

function parseTags(tags: string): string[] {
  return tags.split(',').map(t => t.trim()).filter(Boolean)
}

export function ProjectCard({ project }: ProjectCardProps) {
  const tags = parseTags(project.primaryTags)

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger if clicking a link
    if ((e.target as HTMLElement).closest('a, button')) {
      return
    }
    launchClaude(project)
  }

  const handleLinkClick = (e: React.MouseEvent, url: string) => {
    e.stopPropagation()
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <Card
      className="tech-card cursor-pointer h-full flex flex-col"
      onClick={handleCardClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="glow-cyan">{project.projectName}</CardTitle>
          <div className="flex gap-1">
            <button
              onClick={(e) => handleLinkClick(e, getFolderUrl(project.folderId))}
              className="text-muted-foreground hover:text-accent-cyan transition-colors"
              title="Open folder"
            >
              <Folder className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => handleLinkClick(e, getDocUrl(project.readmeDocId))}
              className="text-muted-foreground hover:text-accent-cyan transition-colors"
              title="Open README"
            >
              <FileText className="h-4 w-4" />
            </button>
          </div>
        </div>
        <CardDescription>{project.briefDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-3">
          <div className="flex gap-2">
            <span className="tech-badge text-xs px-2 py-1 rounded-md">
              {project.type}
            </span>
            <span className="text-xs px-2 py-1 rounded-md bg-secondary text-secondary-foreground">
              {project.status}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="tech-badge text-xs px-2 py-1 rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Click to launch Claude.ai
      </CardFooter>
    </Card>
  )
}
```

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add project card component"
```

---

## Task 12: View Mode - Wiki Card Component

**Files:**
- Create: `src/components/view-mode/WikiCard.tsx`

**Step 1: Create src/components/view-mode/WikiCard.tsx**

```typescript
import { Folder, FileText } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import type { Wiki } from '@/lib/types'
import { launchClaude } from '@/lib/claude'
import { getFolderUrl, getDocUrl } from '@/lib/links'

interface WikiCardProps {
  wiki: Wiki
}

function parseTags(tags: string): string[] {
  return tags.split(',').map(t => t.trim()).filter(Boolean)
}

export function WikiCard({ wiki }: WikiCardProps) {
  const tags = parseTags(wiki.primaryTags)

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('a, button')) {
      return
    }
    launchClaude(wiki)
  }

  const handleLinkClick = (e: React.MouseEvent, url: string) => {
    e.stopPropagation()
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <Card
      className="tech-card cursor-pointer h-full flex flex-col"
      onClick={handleCardClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="glow-purple">{wiki.topic}</CardTitle>
          <div className="flex gap-1">
            <button
              onClick={(e) => handleLinkClick(e, getFolderUrl(wiki.folderId))}
              className="text-muted-foreground hover:text-accent-purple transition-colors"
              title="Open folder"
            >
              <Folder className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => handleLinkClick(e, getDocUrl(wiki.readmeDocId))}
              className="text-muted-foreground hover:text-accent-purple transition-colors"
              title="Open README"
            >
              <FileText className="h-4 w-4" />
            </button>
          </div>
        </div>
        <CardDescription>{wiki.briefDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="tech-badge text-xs px-2 py-1 rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Click to launch Claude.ai
      </CardFooter>
    </Card>
  )
}
```

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add wiki card component"
```

---

## Task 13: Filter Components

**Files:**
- Create: `src/components/filters/SearchBar.tsx`
- Create: `src/hooks/use-filters.ts`

**Step 1: Create src/components/filters/SearchBar.tsx**

```typescript
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchBar({ value, onChange, placeholder = "Search..." }: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-10"
      />
    </div>
  )
}
```

**Step 2: Create src/hooks/use-filters.ts**

```typescript
import { useState, useMemo } from 'react'
import type { Project, Wiki, FilterState } from '@/lib/types'

function parseTags(tags: string): string[] {
  return tags.split(',').map(t => t.trim()).filter(Boolean)
}

export function useFilters() {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    tags: [],
    type: '',
    status: '',
  })

  const setSearch = (search: string) => {
    setFilters(prev => ({ ...prev, search }))
  }

  const setTags = (tags: string[]) => {
    setFilters(prev => ({ ...prev, tags }))
  }

  const setType = (type: string) => {
    setFilters(prev => ({ ...prev, type }))
  }

  const setStatus = (status: string) => {
    setFilters(prev => ({ ...prev, status }))
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      tags: [],
      type: '',
      status: '',
    })
  }

  const filterProjects = (projects: Project[]) => {
    return projects.filter(project => {
      // Search filter
      if (filters.search) {
        const search = filters.search.toLowerCase()
        const matches =
          project.projectName.toLowerCase().includes(search) ||
          project.briefDescription.toLowerCase().includes(search)
        if (!matches) return false
      }

      // Type filter
      if (filters.type && project.type !== filters.type) {
        return false
      }

      // Status filter
      if (filters.status && project.status !== filters.status) {
        return false
      }

      // Tags filter
      if (filters.tags.length > 0) {
        const projectTags = parseTags(project.primaryTags)
        const hasTag = filters.tags.some(tag => projectTags.includes(tag))
        if (!hasTag) return false
      }

      return true
    })
  }

  const filterWikis = (wikis: Wiki[]) => {
    return wikis.filter(wiki => {
      // Search filter
      if (filters.search) {
        const search = filters.search.toLowerCase()
        const matches =
          wiki.topic.toLowerCase().includes(search) ||
          wiki.briefDescription.toLowerCase().includes(search)
        if (!matches) return false
      }

      // Tags filter
      if (filters.tags.length > 0) {
        const wikiTags = parseTags(wiki.primaryTags)
        const hasTag = filters.tags.some(tag => wikiTags.includes(tag))
        if (!hasTag) return false
      }

      return true
    })
  }

  const getAllTags = (projects: Project[], wikis: Wiki[]) => {
    const allTags = new Set<string>()

    projects.forEach(p => {
      parseTags(p.primaryTags).forEach(tag => allTags.add(tag))
    })

    wikis.forEach(w => {
      parseTags(w.primaryTags).forEach(tag => allTags.add(tag))
    })

    return Array.from(allTags).sort()
  }

  const getAllTypes = (projects: Project[]) => {
    return Array.from(new Set(projects.map(p => p.type))).sort()
  }

  const getAllStatuses = (projects: Project[]) => {
    return Array.from(new Set(projects.map(p => p.status))).sort()
  }

  const hasActiveFilters =
    filters.search !== '' ||
    filters.tags.length > 0 ||
    filters.type !== '' ||
    filters.status !== ''

  return {
    filters,
    setSearch,
    setTags,
    setType,
    setStatus,
    clearFilters,
    filterProjects,
    filterWikis,
    getAllTags,
    getAllTypes,
    getAllStatuses,
    hasActiveFilters,
  }
}
```

**Step 3: Commit**

```bash
git add .
git commit -m "feat: add search and filter functionality"
```

---

## Task 14: View Mode Page

**Files:**
- Create: `src/pages/ViewMode.tsx`

**Step 1: Create src/pages/ViewMode.tsx**

```typescript
import { SearchBar } from '@/components/filters/SearchBar'
import { ProjectCard } from '@/components/view-mode/ProjectCard'
import { WikiCard } from '@/components/view-mode/WikiCard'
import { Button } from '@/components/ui/button'
import { useProjects } from '@/hooks/use-projects'
import { useWikis } from '@/hooks/use-wikis'
import { useFilters } from '@/hooks/use-filters'

interface ViewModeProps {
  spreadsheetId: string
}

export function ViewMode({ spreadsheetId }: ViewModeProps) {
  const { projects, isLoading: projectsLoading } = useProjects(spreadsheetId)
  const { wikis, isLoading: wikisLoading } = useWikis(spreadsheetId)

  const {
    filters,
    setSearch,
    setTags,
    setType,
    setStatus,
    clearFilters,
    filterProjects,
    filterWikis,
    getAllTags,
    getAllTypes,
    getAllStatuses,
    hasActiveFilters,
  } = useFilters()

  const filteredProjects = filterProjects(projects)
  const filteredWikis = filterWikis(wikis)
  const allTags = getAllTags(projects, wikis)
  const allTypes = getAllTypes(projects)
  const allStatuses = getAllStatuses(projects)

  const isLoading = projectsLoading || wikisLoading

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="space-y-3">
        <SearchBar
          value={filters.search}
          onChange={setSearch}
          placeholder="Search projects and wikis..."
        />
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Projects Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">
          <span className="glow-cyan">Projects</span>
        </h2>
        {filteredProjects.length === 0 ? (
          <p className="text-muted-foreground">No projects found</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </section>

      {/* Wikis Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">
          <span className="glow-purple">Wikis</span>
        </h2>
        {filteredWikis.length === 0 ? (
          <p className="text-muted-foreground">No wikis found</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredWikis.map((wiki) => (
              <WikiCard key={wiki.id} wiki={wiki} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add view mode page with filtering"
```

---

## Task 15: Edit Mode - Create Dialog

**Files:**
- Create: `src/components/edit-mode/CreateProjectDialog.tsx`
- Create: `src/components/edit-mode/CreateWikiDialog.tsx`

**Step 1: Create src/components/edit-mode/CreateProjectDialog.tsx**

```typescript
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Project } from '@/lib/types'

interface CreateProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: Omit<Project, 'id' | 'dateCreated' | 'lastUpdated'>) => Promise<void>
}

export function CreateProjectDialog({ open, onOpenChange, onSubmit }: CreateProjectDialogProps) {
  const [formData, setFormData] = useState({
    projectName: '',
    type: '',
    status: '',
    folderId: '',
    primaryTags: '',
    readmeDocId: '',
    briefDescription: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onSubmit(formData)
      setFormData({
        projectName: '',
        type: '',
        status: '',
        folderId: '',
        primaryTags: '',
        readmeDocId: '',
        briefDescription: '',
      })
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to create project:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Fill in the details for the new project
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Project Name *</label>
            <Input
              value={formData.projectName}
              onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Type *</label>
            <Input
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Status *</label>
            <Input
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Folder ID</label>
            <Input
              value={formData.folderId}
              onChange={(e) => setFormData({ ...formData, folderId: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Tags (comma-separated) *</label>
            <Input
              value={formData.primaryTags}
              onChange={(e) => setFormData({ ...formData, primaryTags: e.target.value })}
              placeholder="tag1, tag2, tag3"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">README Doc ID</label>
            <Input
              value={formData.readmeDocId}
              onChange={(e) => setFormData({ ...formData, readmeDocId: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Brief Description</label>
            <Input
              value={formData.briefDescription}
              onChange={(e) => setFormData({ ...formData, briefDescription: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
```

**Step 2: Create src/components/edit-mode/CreateWikiDialog.tsx**

```typescript
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Wiki } from '@/lib/types'

interface CreateWikiDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: Omit<Wiki, 'id' | 'dateCreated' | 'lastUpdated'>) => Promise<void>
}

export function CreateWikiDialog({ open, onOpenChange, onSubmit }: CreateWikiDialogProps) {
  const [formData, setFormData] = useState({
    topic: '',
    folderId: '',
    primaryTags: '',
    readmeDocId: '',
    briefDescription: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onSubmit(formData)
      setFormData({
        topic: '',
        folderId: '',
        primaryTags: '',
        readmeDocId: '',
        briefDescription: '',
      })
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to create wiki:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Wiki</DialogTitle>
          <DialogDescription>
            Fill in the details for the new wiki
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Topic *</label>
            <Input
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Folder ID</label>
            <Input
              value={formData.folderId}
              onChange={(e) => setFormData({ ...formData, folderId: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Tags (comma-separated) *</label>
            <Input
              value={formData.primaryTags}
              onChange={(e) => setFormData({ ...formData, primaryTags: e.target.value })}
              placeholder="tag1, tag2, tag3"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">README Doc ID</label>
            <Input
              value={formData.readmeDocId}
              onChange={(e) => setFormData({ ...formData, readmeDocId: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Brief Description</label>
            <Input
              value={formData.briefDescription}
              onChange={(e) => setFormData({ ...formData, briefDescription: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
```

**Step 3: Commit**

```bash
git add .
git commit -m "feat: add create dialogs for projects and wikis"
```

---

## Task 16: Edit Mode Page (Simplified)

**Files:**
- Create: `src/pages/EditMode.tsx`

**Step 1: Create src/pages/EditMode.tsx**

```typescript
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CreateProjectDialog } from '@/components/edit-mode/CreateProjectDialog'
import { CreateWikiDialog } from '@/components/edit-mode/CreateWikiDialog'
import { useProjects } from '@/hooks/use-projects'
import { useWikis } from '@/hooks/use-wikis'
import { Trash2 } from 'lucide-react'

interface EditModeProps {
  spreadsheetId: string
}

export function EditMode({ spreadsheetId }: EditModeProps) {
  const { projects, createProject, deleteProject, isLoading: projectsLoading } = useProjects(spreadsheetId)
  const { wikis, createWiki, deleteWiki, isLoading: wikisLoading } = useWikis(spreadsheetId)

  const [createProjectOpen, setCreateProjectOpen] = useState(false)
  const [createWikiOpen, setCreateWikiOpen] = useState(false)

  const isLoading = projectsLoading || wikisLoading

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Projects Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">
            <span className="glow-cyan">Projects</span>
          </h2>
          <Button onClick={() => setCreateProjectOpen(true)}>
            + New Project
          </Button>
        </div>

        <div className="tech-card rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">ID</th>
                  <th className="px-4 py-3 text-left font-medium">Name</th>
                  <th className="px-4 py-3 text-left font-medium">Type</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Tags</th>
                  <th className="px-4 py-3 text-left font-medium">Description</th>
                  <th className="px-4 py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project, index) => (
                  <tr key={project.id} className="border-t border-border">
                    <td className="px-4 py-3 text-muted-foreground text-xs">{project.id}</td>
                    <td className="px-4 py-3">{project.projectName}</td>
                    <td className="px-4 py-3">{project.type}</td>
                    <td className="px-4 py-3">{project.status}</td>
                    <td className="px-4 py-3">{project.primaryTags}</td>
                    <td className="px-4 py-3">{project.briefDescription}</td>
                    <td className="px-4 py-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (confirm('Delete this project?')) {
                            deleteProject(index + 2) // +2 for 1-indexed and header row
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Wikis Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">
            <span className="glow-purple">Wikis</span>
          </h2>
          <Button onClick={() => setCreateWikiOpen(true)}>
            + New Wiki
          </Button>
        </div>

        <div className="tech-card rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">ID</th>
                  <th className="px-4 py-3 text-left font-medium">Topic</th>
                  <th className="px-4 py-3 text-left font-medium">Tags</th>
                  <th className="px-4 py-3 text-left font-medium">Description</th>
                  <th className="px-4 py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {wikis.map((wiki, index) => (
                  <tr key={wiki.id} className="border-t border-border">
                    <td className="px-4 py-3 text-muted-foreground text-xs">{wiki.id}</td>
                    <td className="px-4 py-3">{wiki.topic}</td>
                    <td className="px-4 py-3">{wiki.primaryTags}</td>
                    <td className="px-4 py-3">{wiki.briefDescription}</td>
                    <td className="px-4 py-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (confirm('Delete this wiki?')) {
                            deleteWiki(index + 2)
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <CreateProjectDialog
        open={createProjectOpen}
        onOpenChange={setCreateProjectOpen}
        onSubmit={createProject}
      />

      <CreateWikiDialog
        open={createWikiOpen}
        onOpenChange={setCreateWikiOpen}
        onSubmit={createWiki}
      />
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add edit mode page with tables and delete functionality"
```

---

## Task 17: Main App Component

**Files:**
- Create: `src/App.tsx`
- Create: `src/main.tsx`

**Step 1: Create src/App.tsx**

```typescript
import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Background } from '@/components/layout/Background'
import { SheetsSetupWizard } from '@/components/sheets'
import { ViewMode } from '@/pages/ViewMode'
import { EditMode } from '@/pages/EditMode'
import { useSettings } from '@/hooks/use-settings'
import { SERVICE_ACCOUNT_EMAIL } from '@/config/constants'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
})

function AppContent() {
  const { spreadsheetId, connectSpreadsheet, isInitializing, error } = useSettings()
  const [inputValue, setInputValue] = useState('')

  const handleConnect = async () => {
    await connectSpreadsheet(inputValue)
  }

  if (!spreadsheetId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative">
        <Background />
        <div className="relative z-10 w-full">
          <SheetsSetupWizard
            serviceAccountEmail={SERVICE_ACCOUNT_EMAIL}
            inputValue={inputValue}
            onInputChange={setInputValue}
            onConnect={handleConnect}
            isConnecting={isInitializing}
            error={error}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      <Background />
      <main className="container max-w-6xl mx-auto px-4 py-8 relative z-10">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">
            <span className="glow-cyan">Recall</span>
          </h1>
        </header>

        <Tabs defaultValue="view" className="space-y-6">
          <TabsList>
            <TabsTrigger value="view">View</TabsTrigger>
            <TabsTrigger value="edit">Edit</TabsTrigger>
          </TabsList>

          <TabsContent value="view">
            <ViewMode spreadsheetId={spreadsheetId} />
          </TabsContent>

          <TabsContent value="edit">
            <EditMode spreadsheetId={spreadsheetId} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  )
}

export default App
```

**Step 2: Create src/main.tsx**

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

**Step 3: Commit**

```bash
git add .
git commit -m "feat: add main app component with tab navigation"
```

---

## Task 18: PWA Icons and Final Polish

**Files:**
- Create: `public/icon-192.png` (placeholder)
- Create: `public/icon-512.png` (placeholder)

**Step 1: Create placeholder icons**

Note: For now, create simple placeholder icons. Replace with proper icons later.

Run: `mkdir -p public`

For actual icons, use a tool like https://realfavicongenerator.net/ with the Recall branding (cyan/purple colors).

**Step 2: Test the app**

Run: `npm run dev`
Expected: App starts on http://localhost:5173

**Step 3: Test setup wizard**
- Enter a valid spreadsheet ID
- Verify connection works
- Check that projects and wikis sheets are validated

**Step 4: Test view mode**
- Verify cards display correctly
- Test clicking cards (opens Claude.ai)
- Test folder/doc links
- Test search and filters

**Step 5: Test edit mode**
- Verify tables display all data
- Test creating new projects/wikis
- Test delete functionality

**Step 6: Build for production**

Run: `npm run build`
Expected: Build succeeds, creates dist/ directory

**Step 7: Final commit**

```bash
git add .
git commit -m "feat: add PWA icons and complete initial implementation"
```

---

## Summary

This plan implements a complete PWA for managing projects and wikis from Google Sheets with:

- ✅ Setup wizard with sheet validation
- ✅ Two modes (View/Edit) with tab navigation
- ✅ Card grid display for projects and wikis
- ✅ Search and filtering capabilities
- ✅ Claude.ai integration with prompt generation
- ✅ Google Drive/Docs link integration
- ✅ Create and delete functionality
- ✅ voget-io tech theme with visual effects
- ✅ PWA configuration for installability

**Next Steps After Implementation:**
1. Create proper PWA icons (192px and 512px)
2. Test thoroughly with real data
3. Deploy to Firebase Hosting or similar
4. Add inline editing for table cells (enhancement)
5. Add more advanced filtering UI (dropdowns for tags/type/status)
