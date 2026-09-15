import { http, HttpResponse } from "msw"
import { userBuilder } from "./builders/user-builder"

export const handlers = [
  http.get("/api/user", () => HttpResponse.json(userBuilder().build())),
]
