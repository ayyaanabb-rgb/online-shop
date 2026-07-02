# System Design: Online Shop (Java Static Site)

## 1. System Context
This document outlines the architecture of the Online Shop static website. The project utilizes a Java-based static site generator (e.g., JBake or a similar custom Java generator) to compile templates and Markdown/Asciidoc content into a static HTML/CSS/JS frontend.

## 2. Architecture Overview
- **Content Creation**: Product details and blog posts are written in Markdown.
- **Generator (Java)**: The core build system uses Java to parse content, apply UI templates (e.g., Freemarker or Thymeleaf), and output static assets.
- **Frontend**: The output is pure static files (HTML, CSS, JavaScript) ensuring extremely fast loading times and robust security.
- **Hosting**: The final `build/` directory is deployed to a static hosting provider (e.g., Netlify, GitHub Pages, or AWS S3).

## 3. Data Flow
1. **Developer/Content Editor** modifies source Markdown or HTML templates.
2. **Build Process** is triggered (via Maven/Gradle).
3. **Java SSG Engine** reads all data files and layout templates.
4. Engine writes final static HTML files to the `/dist` or `/public` folder.

## 4. UI/UX Design System
- **Styling**: Vanilla CSS with customized, premium design aesthetics (glassmorphism, vibrant palettes, smooth micro-animations).
- **Interactivity**: Vanilla JavaScript for dynamic elements on the static pages (e.g., shopping cart logic stored in `localStorage`, modals, filtering).

## 5. Security & Performance
- **Security**: No database or backend server means no direct attack vectors like SQL injection on the serving end.
- **Performance**: Pre-compiled pages can be cached globally on CDNs. SEO best practices (Meta tags, H1s, Semantic HTML) are baked into the Java templates.