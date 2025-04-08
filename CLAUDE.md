# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- `npm run dev` - Start development server
- `npm run build` - Build project (TypeScript build + Vite build)
- `npm run lint` - Run ESLint
- `npm run preview` - Preview built application

## Code Style Guidelines
- **TypeScript**: Strict typing with `noUnusedLocals` and `noUnusedParameters` enabled
- **Imports**: Use named imports, group imports by external/internal
- **Component structure**: Functional components with TypeScript interfaces for props
- **Naming**: PascalCase for components, camelCase for functions/variables
- **Error handling**: Use proper type checking and validation
- **Styles**: Follow React PDF styling constraints with validation
- **Code organization**: Keep related functionality in dedicated directories (html/, styles/, table/)
- **Type definitions**: Create interfaces in component files or dedicated types.ts files