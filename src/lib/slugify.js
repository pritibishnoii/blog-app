export function slugify(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Duplicate slug edge case: append a short random suffix
export function randomSuffix(length = 5) {
  return Math.random().toString(36).slice(2, 2 + length);
}
