export const SCORING = {
  points: {
    module:   { BEGINNER: 10, INTERMEDIATE: 25, ADVANCED: 40 },
    scenario: { BEGINNER: 30, INTERMEDIATE: 50, ADVANCED: 75 },
    mission:  { BEGINNER: 25, INTERMEDIATE: 40, ADVANCED: 60 },
  },
  levels: [
    { level: 1, name: "Aware",        minPoints: 0   },
    { level: 2, name: "Informed",     minPoints: 100 },
    { level: 3, name: "Practitioner", minPoints: 300 },
    { level: 4, name: "Leader",       minPoints: 600 },
  ],
} as const

export function getPoints(
  type: keyof typeof SCORING.points,
  difficulty: string
): number {
  const tier = SCORING.points[type]
  return (tier as Record<string, number>)[difficulty] ?? tier.INTERMEDIATE
}
