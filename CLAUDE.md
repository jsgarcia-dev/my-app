# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Install dependencies (uses pnpm)
pnpm install

# Run development server with Turbopack
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint

# Format code with Prettier
pnpm format
```

## Architecture Overview

This is a Next.js 15.3.2 application for Studio Garcia - a multi-purpose commercial complex that rents equipped spaces for various professionals including nutritionists, psychologists, jewelry stores, clothing boutiques, and other businesses. The website uses the App Router pattern with TypeScript and Tailwind CSS v4.

### Core Technologies

#### Framework & Build

- **Next.js 15.3.2** with App Router (`/app` directory)
- **React 19** with extensive use of client components
- **TypeScript** in strict mode with path alias `@/*`

#### Styling & UI

- **Tailwind CSS v4** with PostCSS configuration
- **shadcn/ui** components (New York style, with CVA for variants)
- **tw-animate-css** for additional animation utilities
- **Custom theme tokens** mapped to CSS variables in `globals.css`
- **cn() utility** from `lib/utils.ts` for conditional class merging

#### Animation & Graphics

- **GSAP** with React integration for complex animations
  - Menu animations with timeline control
  - Text animations with character splitting
  - Proper cleanup in useEffect hooks
- **Split-type** for text splitting and animation
- **OGL** for WebGL shader-based backgrounds
  - Custom vertex and fragment shaders
  - Mouse interaction support
  - Hex to vec4 color conversion

### Component Architecture

#### Key Patterns

- **Client-First Components**: Heavy use of 'use client' directive for interactivity
- **Composition Pattern**: Components use composition (e.g., Button with asChild prop)
- **Animation Integration**: Most components include GSAP or OGL animations
- **Responsive Design**: Custom breakpoint handling, especially in Menu component
- **Type Safety**: Full TypeScript with proper interface definitions

#### Component Structure

- `/components/ui/` - shadcn/ui components with CVA variants
- `/components/menu/` - Navigation with GSAP animations and responsive behavior
- `/components/` - Feature components (AnimatedText, DynamicBackground, balatro)

### Animation Implementation Details

#### GSAP Usage

- Timeline-based animations with proper pause/play control
- Cleanup patterns: Always kill timelines on unmount
- Mouse interaction handling with normalized coordinates
- Stagger effects for sequential animations

#### OGL/WebGL Implementation

- Renderer setup with proper resize handling
- Uniform-based shader parameters for real-time control
- Performance optimizations with pixelFilter parameter
- WebGL context cleanup on component unmount

### Styling Conventions

- Utility-first approach with Tailwind classes
- Responsive utilities throughout (`lg:` breakpoint = 1024px)
- Dark mode support via `.dark` class variants
- oklch color space for modern color management
- Consistent spacing and typography scales

### Important Configuration

- **components.json** - shadcn/ui configuration with gray base color
- **ESLint** with Next.js Core Web Vitals and Prettier integration
- **Prettier** with Tailwind CSS plugin for class sorting
- Images from `via.placeholder.com` allowed in Next.js config

### Project Context - Studio Garcia

#### Business Model
Studio Garcia is a commercial complex offering:
- Fully equipped spaces for rent to various professionals
- Shared infrastructure (reception, waiting area, parking)
- Flexible rental options for different business types
- Current tenants include: nutritionists, psychologists, jewelry stores, clothing boutiques

#### Website Goals
- Present the Studio Garcia brand professionally
- Showcase available spaces with photos and details
- Highlight current professionals and services
- Facilitate contact and scheduling of visits
- Build trust through testimonials and infrastructure details

#### Key Sections Implementation
1. **Hero Section**: Split-screen design with Balatro animation and main value proposition
2. **About Section**: Infrastructure benefits with video showcase
3. **Current Professionals**: Card grid showcasing existing tenants
4. **Available Spaces**: Photo gallery with room details and CTA
5. **CTA Section**: Strong call-to-action with subtle Balatro background
6. **Footer**: Complete contact information and quick links

#### Design Principles
- Professional and trustworthy appearance
- Elegant animations using GSAP ScrollTrigger
- Consistent blue color scheme for corporate feel
- Responsive design optimized for all devices
- Clear CTAs throughout the page for conversion
