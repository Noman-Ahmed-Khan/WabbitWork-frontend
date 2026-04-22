/**
 * Search helpers used by module-level filters.
 */

export function normalizeSearchQuery(query) {
  return String(query ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
}

function toSearchableText(value) {
  if (value == null) return ''

  if (Array.isArray(value)) {
    return value.map(toSearchableText).filter(Boolean).join(' ')
  }

  if (typeof value === 'object') {
    return Object.values(value).map(toSearchableText).filter(Boolean).join(' ')
  }

  return String(value)
}

export function matchesSearchQuery(values, query) {
  const normalizedQuery = normalizeSearchQuery(query)
  if (!normalizedQuery) return true

  const list = Array.isArray(values) ? values : [values]
  const haystack = normalizeSearchQuery(list.map(toSearchableText).filter(Boolean).join(' '))

  return haystack.includes(normalizedQuery)
}

export function filterBySearch(items, query, getValues) {
  if (!Array.isArray(items)) return []
  if (!normalizeSearchQuery(query)) return items

  return items.filter((item) => matchesSearchQuery(getValues(item), query))
}
