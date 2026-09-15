import { faker } from "@faker-js/faker"
import type { User } from "../../features/user/user"

/** Immutable builder shared by demo handlers and tests. */
export function userBuilder(overrides: Partial<User> = {}) {
  const user: User = {
    id: faker.number.int({ min: 100_000, max: 999_999 }).toString(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    ...overrides,
  }

  return {
    with: (values: Partial<User>) => userBuilder({ ...user, ...values }),
    build: (): User => ({ ...user }),
  }
}
