"use client"

import { useTheme } from "@/components/ThemeProvider"
import * as Icons from "@radix-ui/react-icons"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('system')
    } else {
      setTheme('light')
    }
  }

  const getIcon = () => {
    if (theme === 'light') {
      return <Icons.SunIcon className="h-5 w-5" />
    } else if (theme === 'dark') {
      return <Icons.MoonIcon className="h-5 w-5" />
    } else {
      return <Icons.DesktopIcon className="h-5 w-5" />
    }
  }

  return (
    <button
      onClick={toggleTheme}
      className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:bg-accent hover:text-accent-foreground h-10 w-10"
      aria-label="Toggle theme"
    >
      {getIcon()}
    </button>
  )
}

