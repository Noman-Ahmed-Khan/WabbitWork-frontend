import { useLocation } from 'react-router-dom'
import useUIStore from '../stores/uiStore'
import { getSearchScope } from '../config/searchScopes'

/**
 * Route-aware search state helper.
 * Keeps the top search bar in sync with the active module.
 */
export default function useRouteSearch() {
  const location = useLocation()
  const scope = getSearchScope(location.pathname)

  const searchQuery = useUIStore(
    (state) => state.searchQueries[scope.key] ?? ''
  )
  const setSearchQuery = useUIStore((state) => state.setSearchQuery)
  const clearSearchQuery = useUIStore((state) => state.clearSearchQuery)

  return {
    scope,
    searchQuery,
    hasSearchQuery: searchQuery.trim().length > 0,
    setSearchQuery: (value) => setSearchQuery(scope.key, value),
    clearSearchQuery: () => clearSearchQuery(scope.key),
  }
}
