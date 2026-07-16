// Strips HTML tags and estimates reading time at ~200 wpm
export function calculateReadTime(htmlContent) {
  const text = htmlContent.replace(/<[^>]*>/g, ' ');
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.ceil(words / 200);
  return Math.max(1, minutes);
}
