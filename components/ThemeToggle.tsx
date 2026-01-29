'use client'

import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.setAttribute('data-theme', savedTheme)
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full transition-all hover:opacity-80"
      style={{
        backgroundColor: 'var(--color-card-bg)',
        border: '1px solid var(--color-border)',
      }}
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 15C12.7614 15 15 12.7614 15 10C15 7.23858 12.7614 5 10 5C7.23858 5 5 7.23858 5 10C5 12.7614 7.23858 15 10 15Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: 'var(--color-text)' }}
          />
          <path
            d="M10 1V3M10 17V19M19 10H17M3 10H1M16.07 16.07L14.65 14.65M5.35 5.35L3.93 3.93M16.07 3.93L14.65 5.35M5.35 14.65L3.93 16.07"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: 'var(--color-text)' }}
          />
        </svg>
      ) : (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17 10.79C16.8427 12.4921 16.1039 14.0956 14.8993 15.3469C13.6946 16.5981 12.0915 17.4277 10.3524 17.7073C8.61328 17.9869 6.83003 17.7012 5.27176 16.8889C3.7135 16.0767 2.45729 14.7838 1.68051 13.2044C0.90373 11.625 0.645345 9.84284 0.942475 8.10977C1.2396 6.37671 2.07692 4.77821 3.33638 3.54836C4.59584 2.31851 6.2069 1.51944 7.92251 1.2637C9.63812 1.00797 11.3832 1.30913 12.9 2.12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: 'var(--color-text)' }}
          />
        </svg>
      )}
    </button>
  )
}
