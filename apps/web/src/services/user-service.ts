import type { User } from "@/features/user/user"

/**
 * The boundary between application code and the user API.
 *
 * Future changes—generated clients, authentication, a different request
 * library, or endpoint changes—belong here rather than in data consumers.
 */
export async function getUser(): Promise<User> {
  const response = await fetch("/api/user")
  if (!response.ok) throw new Error("Unable to load user information")

  const data: unknown = await response.json()
  if (
    typeof data !== "object" ||
    data === null ||
    !("id" in data) ||
    typeof data.id !== "string" ||
    !("name" in data) ||
    typeof data.name !== "string" ||
    !("email" in data) ||
    typeof data.email !== "string"
  ) {
    throw new Error("Invalid user response")
  }

  return { id: data.id, name: data.name, email: data.email }
}
