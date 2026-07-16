// Auto-generates a short plain-text preview from rich text HTML content
export function generateExcerpt(htmlContent, length = 160) {
  const text = htmlContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return text.length > length ? `${text.slice(0, length).trim()}…` : text;
}
