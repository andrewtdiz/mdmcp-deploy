import { home } from '../md/_generated/home'
import { development } from '../md/_generated/development'
import { markdown_support} from '../md/_generated/markdown_support'
import { project_structure} from '../md/_generated/project_structure'
import { quick_start} from '../md/_generated/quick_start'
import { technology_stack} from '../md/_generated/technology_stack'

const markdownContent: Record<string, string | ((variables: any) => string)> = {
  home,
  development,
  markdown_support,
  project_structure,
  quick_start,
  technology_stack
}

export function loadMarkdown(route: string, variables: Record<string, string> = {}): string {
  const content = markdownContent[route] || home;
  if (typeof content === 'function') {
    return content(variables);
  }
  return content;
}