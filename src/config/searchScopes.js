export const searchScopes = {
  '/dashboard': {
    label: 'Dashboard',
    placeholder: 'SEARCH TASKS, PROJECTS, FEEDS...',
  },
  '/teams': {
    label: 'Teams',
    placeholder: 'SEARCH TEAMS...',
  },
  '/tasks': {
    label: 'Tasks',
    placeholder: 'SEARCH TASKS...',
  },
  '/invitations': {
    label: 'Invitations',
    placeholder: 'SEARCH INVITATIONS...',
  },
  '/notifications': {
    label: 'Notifications',
    placeholder: 'SEARCH NOTIFICATIONS...',
  },
  '/profile': {
    label: 'Settings',
    placeholder: 'SEARCH SETTINGS, SESSIONS...',
  },
}

const defaultSearchScope = {
  label: 'Workspace',
  placeholder: 'SEARCH...',
}

export function getSearchScope(pathname) {
  return {
    key: pathname || 'global',
    ...(searchScopes[pathname] || defaultSearchScope),
  }
}
