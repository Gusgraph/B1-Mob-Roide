// Ø£ÙŽØ¹ÙÙˆØ°Ù Ø¨ÙÙ±Ù„Ù„Ù‘ÙŽÙ‡Ù Ù…ÙÙ†Ù’ Ø§Ù„Ù’Ø´ÙŽÙŠÙ’Ø·ÙŽØ§Ù†Ù Ø§Ù„Ù’Ø±ÙŽØ¬ÙÙŠÙ…Ù âœ§ Ø¨ÙØ³Ù’Ù…Ù Ø§Ù„Ù„Ù‘ÙŽÙ‡Ù Ø§Ù„Ø±Ù‘ÙŽØ­Ù’Ù…ÙŽÙ°Ù†Ù Ø§Ù„Ø±Ù‘ÙŽØ­ÙÙŠÙ…Ù
// Bismillahi ar-Rahmani ar-Rahim
// version: 1.0.0
// ======================================================
// - Bismel1Mobile
// - Gusgraph
// - Author: Gus Kazem
// - https://Gusgraph.com
// - File Path: pagination.ts - src/utils/pagination.ts
// =====================================================
export const LIST_PAGE_SIZE = 7;

export const paginatedEndpoint = (endpoint: string, limit = LIST_PAGE_SIZE, offset = 0) => {
  const separator = endpoint.includes('?') ? '&' : '?';

  return `${endpoint}${separator}limit=${limit}&offset=${offset}`;
};

export const uniqueRows = <T>(currentRows: T[], nextRows: T[], rowKey: (row: T, index: number) => string) => {
  const seen = new Set(currentRows.map(rowKey));
  const uniqueNextRows = nextRows.filter((row, index) => {
    const key = rowKey(row, currentRows.length + index);

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);

    return true;
  });

  return [...currentRows, ...uniqueNextRows];
};
