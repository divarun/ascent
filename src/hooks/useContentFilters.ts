import { useState, useEffect } from "react"

const ROLE_KEY = "ascent_guest_role"

export function useContentFilters<T extends { roles: string[]; difficulty: string }>(items: T[]) {
  const [role, setRole] = useState("ALL")
  const [difficulty, setDifficulty] = useState("ALL")
  const [mounted, setMounted] = useState(false)

  const showRoleFilter = ["PM", "EM", "IC"].some(r => items.some(item => !item.roles.includes(r)))
  const showDiffFilter = new Set(items.map(i => i.difficulty)).size > 1

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem(ROLE_KEY)
    if (saved) setRole(saved)
  }, [])

  function selectRole(r: string) {
    const next = role === r && r !== "ALL" ? "ALL" : r
    setRole(next)
    if (next !== "ALL") localStorage.setItem(ROLE_KEY, next)
    else localStorage.removeItem(ROLE_KEY)
  }

  function selectDifficulty(d: string) {
    setDifficulty(d)
  }

  function resetAll() {
    setRole("ALL")
    setDifficulty("ALL")
    localStorage.removeItem(ROLE_KEY)
  }

  const visible = items.filter(item => {
    const roleMatch = role === "ALL" || item.roles.includes(role)
    const diffMatch = difficulty === "ALL" || item.difficulty === difficulty
    return roleMatch && diffMatch
  })

  return { role, difficulty, selectRole, selectDifficulty, resetAll, visible, showRoleFilter, showDiffFilter, mounted }
}
