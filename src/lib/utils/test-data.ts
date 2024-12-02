import { generateDummyMatches } from "./dummy-data"
import { getUsers } from "../users"
import { createDummyMatches } from "../services/match-service"

export async function populateTestData(userId: string) {
  try {
    const users = await getUsers()
    if (users.length < 4) {
      throw new Error("Need at least 4 users to generate test data")
    }

    const matches = generateDummyMatches(users)
    await createDummyMatches(matches, userId)
    return `Successfully created ${matches.length} test matches`
  } catch (error) {
    console.error("Error generating test data:", error)
    throw error
  }
}