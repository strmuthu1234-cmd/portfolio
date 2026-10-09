// Access token lives in memory only (not readable after a page reload and not
// exposed to storage-scraping scripts). The refresh token is kept in
// sessionStorage so an admin session survives reloads but not a closed tab.
const REFRESH_KEY = 'mp_refresh'
let accessToken = null

export const tokenStore = {
  getAccess: () => accessToken,
  setAccess: (token) => {
    accessToken = token
  },
  getRefresh: () => {
    try {
      return sessionStorage.getItem(REFRESH_KEY)
    } catch {
      return null
    }
  },
  setRefresh: (token) => {
    try {
      token ? sessionStorage.setItem(REFRESH_KEY, token) : sessionStorage.removeItem(REFRESH_KEY)
    } catch {
      /* storage unavailable */
    }
  },
  clear() {
    accessToken = null
    this.setRefresh(null)
  },
}
