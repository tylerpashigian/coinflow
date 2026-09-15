import { StrictMode } from "react"
import { render, screen } from "@testing-library/react"
import { http, HttpResponse } from "msw"
import { describe, expect, it } from "vitest"
import { App } from "./App"
import { userBuilder } from "./mocks/builders/user-builder"
import { server } from "./test/setup"

describe("user information", () => {
  it("loads a generated mocked user alongside the boilerplate", async () => {
    render(
      <StrictMode>
        <App />
      </StrictMode>
    )
    expect(
      screen.getByRole("heading", { level: 1, name: "Project ready!" })
    ).toBeVisible()
    expect(screen.getByRole("status")).toHaveTextContent("Loading user…")
    expect(await screen.findByText(/^Signed in as .+/)).toBeVisible()
  })

  it("renders the endpoint response rather than a hard-coded name", async () => {
    const user = userBuilder().with({ name: "Jordan Lee" }).build()
    server.use(http.get("/api/user", () => HttpResponse.json(user)))
    render(<App />)
    expect(await screen.findByText("Signed in as Jordan Lee")).toBeVisible()
  })

  it("shows a useful message when the request fails", async () => {
    server.use(
      http.get("/api/user", () => new HttpResponse(null, { status: 500 }))
    )
    render(<App />)
    expect(
      await screen.findByText("Unable to load user information.")
    ).toBeVisible()
  })
})
