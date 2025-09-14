export const project_structure = `# 🏗️ Project Structure

MDMCP is a monorepo with frontend and backend components.

## Key Directories

**\`frontend/\`** - Next.js application
- \`app/\` - Next.js App Router pages
- \`src/components/\` - Reusable UI components
- \`src/utils/\` - Utility functions

**\`mcp/\`** - MCP server implementation
- \`index.ts\` - Server entry point
- \`tools/\` - MCP protocol tools
- \`utils/\` - Server utilities

**\`md/\`** - Markdown content system
- \`converter.ts\` - Markdown ↔ TypeScript converter
- \`_generated/\` - Auto-generated files
- \`*.md\` - Source markdown files

## File Overview
- \`package.json\` - Root dependencies & scripts
- \`dist/\` - Built output
- \`tsconfig.json\` - TypeScript configuration

`;
