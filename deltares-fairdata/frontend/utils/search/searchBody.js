import { buildFilter } from './filters.js'

export default function ({ collections, ...rest } = {}) {
  const body = {
    'filter-lang': 'cql2-json',
    filter: buildFilter(rest),
  }
  if (Array.isArray(collections) && collections.length) {
    body.collections = collections.map(c => typeof c === 'string' ? c : c.id)
  }
  console.log(JSON.stringify(body, null, 2))
  return body
}
