import { PrismaClient } from "@prisma/client"
import { sampleModules } from "../src/data/modules"
import { sampleScenarios } from "../src/data/scenarios"
import { sampleMissions } from "../src/data/missions"

const db = new PrismaClient()

async function main() {
  console.log("Seeding database...")

  // Seed modules
  for (const module of sampleModules) {
    const moduleData = module as any
    await db.module.upsert({
      where: { slug: module.slug },
      update: moduleData,
      create: moduleData,
    })
  }
  console.log(`Seeded ${sampleModules.length} modules`)

  // Seed scenarios
  for (const scenario of sampleScenarios) {
    const { role: _role, roles: _roles, ...rest } = scenario as any
    const roles = ((scenario as any).roles as string[]).map((r: string) => r as "PM" | "EM" | "IC")
    const scenarioData = { ...rest, roles }
    await db.scenario.upsert({
      where: { slug: scenario.slug },
      update: scenarioData,
      create: scenarioData,
    })
  }
  console.log(`Seeded ${sampleScenarios.length} scenarios`)

  // Seed missions
  for (const mission of sampleMissions) {
    await db.mission.upsert({
      where: { slug: mission.slug },
      update: mission as any,
      create: mission as any,
    })
  }
  console.log(`Seeded ${sampleMissions.length} missions`)

  console.log("Done!")
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect())
