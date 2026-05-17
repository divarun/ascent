import { sampleScenarios } from "@/data/scenarios"
import { sampleMissions } from "@/data/missions"

export const GUEST_SCENARIOS = new Set(
  sampleScenarios.filter((s) => s.isUnlocked).map((s) => s.slug)
)

export const GUEST_MISSIONS = new Set(
  sampleMissions.filter((m) => m.isUnlocked).map((m) => m.slug)
)

export function isModuleFree() { return true }
export function isMissionFree(slug: string) { return GUEST_MISSIONS.has(slug) }
export function isScenarioFree(slug: string) { return GUEST_SCENARIOS.has(slug) }
