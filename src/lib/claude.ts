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
