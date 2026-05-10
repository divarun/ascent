import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getLevelLabel(level: number): string {
  const labels: Record<number, string> = {
    1: "Aware",
    2: "Informed",
    3: "Practitioner",
    4: "Leader",
  }
  return labels[level] ?? "Aware"
}

export function getLevelThreshold(level: number): number {
  // Points needed to reach this level
  const thresholds: Record<number, number> = {
    1: 0,
    2: 100,
    3: 300,
    4: 600,
  }
  return thresholds[level] ?? 0
}

export function calculateLevel(points: number): number {
  if (points >= 600) return 4
  if (points >= 300) return 3
  if (points >= 100) return 2
  return 1
}

export function getProfileScoreLabel(score: number): string {
  if (score >= 4) return "Strong"
  if (score >= 3) return "Moderate"
  if (score >= 2) return "Developing"
  return "Weak"
}

export function getProfileScoreColor(score: number): string {
  if (score >= 4) return "text-emerald-600"
  if (score >= 3) return "text-amber-600"
  if (score >= 2) return "text-blue-600"
  return "text-rose-600"
}
