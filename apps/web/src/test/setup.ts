import "@testing-library/jest-dom/vitest"
import { cleanup } from "@testing-library/react"
import { afterAll, afterEach, beforeAll } from "vitest"
import { setupServer } from "msw/node"
import { handlers } from "@/data/mocks/handlers"
import { resetMockStore } from "@/data/mocks/store"

export const server = setupServer(...handlers)

beforeAll(() => server.listen({ onUnhandledRequest: "error" }))
afterEach(() => {
  cleanup()
  server.resetHandlers()
  resetMockStore()
})
afterAll(() => server.close())
