'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button
        className="w-9 h-9 rounded-lg bg-transparent"
        aria-label="Toggle theme"
      />
    )
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-lg bg-blue-100/50 hover:bg-blue-200/50 
                dark:bg-blue-900/50 dark:hover:bg-blue-800/50 
                transition-all duration-200 transform hover:scale-110"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5 text-yellow-500 animate-spin-slow" />
      ) : (
        <Moon className="h-5 w-5 text-blue-600 animate-spin-slow" />
      )}
    </button>
  )
}

// Add this to your tailwind.config.js:
// {
//   theme: {
//     extend: {
//       animation: {
//         'spin-slow': 'spin 1s linear',
//       },
//     },
//   },
// }