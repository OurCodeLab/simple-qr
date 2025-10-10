import React, { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }){
  // track whether the user explicitly chose a theme to avoid overriding it
  const [userSet, setUserSet] = React.useState(false)

  const getSystemPref = () => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('theme')
      if(saved) return saved
      // fallback to system preference when no saved value
      return getSystemPref()
    } catch {
      return 'light'
    }
  })

  // apply theme class to root and persist when userSet is true
  useEffect(() => {
    const root = document.documentElement
    if(theme === 'dark'){
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    try { if(userSet) localStorage.setItem('theme', theme) } catch {}
  }, [theme, userSet])

  // Listen to system preference changes and update theme only if user hasn't set one
  useEffect(() => {
    const mq = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)')
    if(!mq) return
    const handler = (e) => {
      // MediaQueryListEvent for addEventListener, boolean for addListener
      const matches = typeof e === 'boolean' ? e : e.matches
      if(!userSet){
        setTheme(matches ? 'dark' : 'light')
      }
    }

    // modern browsers support addEventListener on MediaQueryList
    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', handler)
      return () => mq.removeEventListener('change', handler)
    }

    // fallback: old browsers used addListener/removeListener and passed a boolean
    if (typeof mq.addListener === 'function') {
      const legacyHandler = (e) => handler(e.matches != null ? e.matches : !!e)
      mq.addListener(legacyHandler)
      return () => mq.removeListener(legacyHandler)
    }
  }, [userSet])

  const toggle = () => {
    setTheme(t => t === 'dark' ? 'light' : 'dark')
    setUserSet(true)
  }

  const setThemeAndSave = (t) => { setTheme(t); setUserSet(true) }

  return (
    <ThemeContext.Provider value={{ theme, setTheme: setThemeAndSave, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(){
  return useContext(ThemeContext)
}

export default ThemeContext
