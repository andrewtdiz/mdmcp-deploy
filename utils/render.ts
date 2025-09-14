
import { loadMarkdown } from './markdownLoader'

export async function render(route: string, context: { sessionId: string, bearerToken?: string, routes: string[], name?: string }) {
    return loadMarkdown(route, { name: context.name || 'User' })
}