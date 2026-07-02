# System Documentation: Online Shop

This document provides developer guidelines and project details for the Java-based static website.

## 1. Prerequisites
- **Java Development Kit (JDK)**: Version 17 or higher.
- **Build Tool**: Maven or Gradle (depending on the specific generator setup).
- **Node.js/npm** (Optional): If frontend assets (CSS/JS) require bundling or minification.

## 2. Project Structure
```text
online-shop/
├── content/              # Markdown or Asciidoc files for pages and products
├── templates/            # Java-based templates (e.g., Freemarker/Thymeleaf)
├── assets/               # CSS, JS, and image files
├── src/main/java/        # Custom Java generator logic (if applicable)
├── system-design.md      # High-level system architecture
├── system-document.md    # Developer documentation (this file)
└── pom.xml / build.gradle # Build configuration
```

## 3. Development Workflow
### Adding Content
To add a new product or page, create a new Markdown file in the `content/` directory. Ensure that the required YAML frontmatter (title, date, price, etc.) is included.

### Modifying Styles
Update the CSS in the `assets/` folder. The project focuses on premium aesthetics, so ensure that any new styles align with the established design system (smooth gradients, micro-animations).

## 4. Build and Deployment
### Building Locally
To generate the static site locally, run the build command (e.g., `mvn clean install` or the specific run task for your generator). This will output the site into a `build/` or `dist/` directory.

### Deployment
The contents of the generated output directory should be uploaded to your static hosting provider (e.g., GitHub Pages, AWS S3).