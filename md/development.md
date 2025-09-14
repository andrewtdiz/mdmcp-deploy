# 🛠️ Development Guide

Development workflows and available scripts.

## Key Scripts
- `npm run dev` - Start both frontend & MCP server
- `npm run dev:frontend` - Frontend only
- `npm run dev:mcp` - MCP server only
- `npm run build` - Build for production
- `npm run generate` - Convert markdown files

## Development Workflow

**Frontend Development:**
```bash
cd frontend
npm run dev  # localhost:3000
```

**MCP Server Development:**
```bash
cd mcp
npm run dev  # Auto-restart enabled
```

**Markdown Content:**
```bash
npm run watch:md     # Watch for changes
npm run generate     # Generate all files
```

## File Conversion
- TypeScript ↔ Markdown conversion system
- Template variable support
- Auto-generation pipeline

