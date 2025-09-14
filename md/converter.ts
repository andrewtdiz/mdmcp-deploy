import fs from 'fs';
import path from 'path';

export interface ConversionResult {
  success: boolean;
  message: string;
  inputFile?: string;
  outputFile?: string;
}

/**
 * Convert a TypeScript file with markdown template literal to markdown
 */
export function convertTsToMd(filePath: string, outputDir?: string): ConversionResult {
  try {
    if (!fs.existsSync(filePath)) {
      return { success: false, message: `File not found: ${filePath}` };
    }

    const content = fs.readFileSync(filePath, 'utf8');

    // Extract the content between backticks, properly handling escaped backticks
    const exportMatch = content.match(/export const \w+ = `/);
    if (!exportMatch) {
      return { success: false, message: `Could not find export statement in ${filePath}` };
    }

    const startIndex = (exportMatch.index || 0) + exportMatch[0].length;
    let endIndex = -1;
    let i = startIndex;

    // Find the closing backtick that's not escaped
    while (i < content.length) {
      if (content[i] === '`') {
        // Check if this backtick is escaped by counting preceding backslashes
        let backslashCount = 0;
        let j = i - 1;
        while (j >= 0 && content[j] === '\\') {
          backslashCount++;
          j--;
        }
        // If even number of backslashes (including 0), the backtick is not escaped
        if (backslashCount % 2 === 0) {
          endIndex = i;
          break;
        }
      }
      i++;
    }

    if (endIndex === -1) {
      return { success: false, message: `Could not find closing backtick in ${filePath}` };
    }

    let markdownContent = content.substring(startIndex, endIndex);

    // Replace escaped backticks with regular backticks
    markdownContent = markdownContent.replace(/\\`/g, '`');

    const fileName = path.basename(filePath);
    const outputFile = fileName.replace('.ts', '.md');
    const outputPath = outputDir ? path.join(outputDir, outputFile) : path.join(path.dirname(filePath), outputFile);

    fs.writeFileSync(outputPath, markdownContent);

    return {
      success: true,
      message: `Converted ${fileName} → ${outputFile}`,
      inputFile: fileName,
      outputFile: outputFile
    };
  } catch (error) {
    return { success: false, message: `Error converting ${filePath}: ${error}` };
  }
}

/**
 * Extract unique template variables from markdown content
 */
function extractTemplateVariables(content: string): string[] {
  const variableMatches = content.match(/\{\{\s*(\w+)\s*\}\}/g);
  if (!variableMatches) return [];

  const variables = variableMatches.map(match => {
    const variableName = match.replace(/\{\{\s*|\s*\}\}/g, '');
    return variableName;
  });

  // Return unique variables
  return [...new Set(variables)];
}

/**
 * Convert a markdown file to TypeScript with template function export
 */
export function convertMdToTs(filePath: string, outputDir?: string): ConversionResult {
  try {
    if (!fs.existsSync(filePath)) {
      return { success: false, message: `File not found: ${filePath}` };
    }

    if (!filePath.endsWith('.md')) {
      return { success: false, message: `Not a markdown file: ${filePath}` };
    }

    // Read the markdown content
    const markdownContent = fs.readFileSync(filePath, 'utf8');

    // Extract template variables
    const templateVariables = extractTemplateVariables(markdownContent);

    // Escape backticks in the markdown content
    const escapedContent = markdownContent.replace(/`/g, '\\`');

    // Get the base filename without extension for the export name
    const fileName = path.basename(filePath);
    const baseName = fileName.replace('.md', '');

    // Create function parameters
    const functionParams = templateVariables.length > 0
      ? `{${templateVariables.join(', ')}}: {${templateVariables.map(v => `${v}: string`).join(', ')}}`
      : '';

    // Create TypeScript content with function export or constant
    let tsContent: string;
    if (templateVariables.length > 0) {
      tsContent = `export function ${baseName}(${functionParams}): string {
  return \`${escapedContent}\`.replace(/\\{\\{\\s*(\\w+)\\s*\\}\\}/g, (match, varName) => {
    const vars: Record<string, string> = {${templateVariables.map(v => `${v}`).join(', ')}};
    return vars[varName] || match;
  });
}
`;
    } else {
      tsContent = `export const ${baseName} = \`${escapedContent}\`;
`;
    }

    const outputFile = fileName.replace('.md', '.ts');
    const outputPath = outputDir ? path.join(outputDir, outputFile) : path.join(path.dirname(filePath), outputFile);

    // Ensure output directory exists
    const outputDirPath = path.dirname(outputPath);
    if (!fs.existsSync(outputDirPath)) {
      fs.mkdirSync(outputDirPath, { recursive: true });
    }

    fs.writeFileSync(outputPath, tsContent);

    return {
      success: true,
      message: `Converted ${fileName} → ${outputFile}${templateVariables.length > 0 ? ` (with variables: ${templateVariables.join(', ')})` : ''}`,
      inputFile: fileName,
      outputFile: outputFile
    };
  } catch (error) {
    return { success: false, message: `Error converting ${filePath}: ${error}` };
  }
}

/**
 * Get all files with a specific extension in a directory
 */
export function getFilesWithExtension(directory: string, extension: string, excludePatterns: string[] = []): string[] {
  try {
    return fs.readdirSync(directory)
      .filter(file => file.endsWith(extension))
      .filter(file => !excludePatterns.some(pattern => file.includes(pattern)));
  } catch (error) {
    return [];
  }
}