import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { SCORING } from "@/config/scoring"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getLevelLabel(level: number): string {
  return SCORING.levels.find((l) => l.level === level)?.name ?? "Aware"
}

export function calculateLevel(points: number): number {
  const sorted = [...SCORING.levels].sort((a, b) => b.minPoints - a.minPoints)
  return sorted.find((l) => points >= l.minPoints)?.level ?? 1
}

export const DIFFICULTY_ORDER: Record<string, number> = { BEGINNER: 0, INTERMEDIATE: 1, ADVANCED: 2 }
