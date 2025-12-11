/**
 * Generate a URL-friendly slug from a title and ID
 * Format: my-blog-title--uuid (double hyphen separates title from full UUID)
 */
export const generateSlug = (title: string, id: string): string => {
  const slugifiedTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, '') // Trim hyphens from start/end
    .substring(0, 50); // Limit length

  return `${slugifiedTitle}--${id}`;
};

/**
 * Extract the UUID from a slug
 * The UUID is after the double hyphen separator
 */
export const extractIdFromSlug = (slug: string): string => {
  const separatorIndex = slug.indexOf('--');
  if (separatorIndex === -1) {
    // Fallback: assume the last segment after a hyphen might be the ID
    return slug;
  }
  return slug.substring(separatorIndex + 2);
};