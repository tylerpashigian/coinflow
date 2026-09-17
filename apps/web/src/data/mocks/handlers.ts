import { http, HttpResponse } from "msw"
import { userBuilder } from "@/data/mocks/builders/user-builder"
import { dashboardOverview } from "@/data/mocks/fixtures/dashboard"
import { customers, payments } from "@/data/mocks/fixtures/entities"

export const handlers = [
  http.get("/api/user", () => HttpResponse.json(userBuilder().build())),
  http.get("/api/dashboard/overview", ({ request }) => {
    const rangeLabel =
      new URL(request.url).searchParams.get("from") === "2026-08-17"
        ? "Aug 17 – Aug 23, 2026"
        : dashboardOverview.rangeLabel
    return HttpResponse.json({ ...dashboardOverview, rangeLabel })
  }),
  http.get("/api/payments", () => HttpResponse.json(payments)),
  http.get("/api/payments/:id", ({ params }) => {
    const payment = payments.find((candidate) => candidate.id === params.id)
    return payment
      ? HttpResponse.json(payment)
      : new HttpResponse(null, { status: 404 })
  }),
  http.get("/api/customers", () => HttpResponse.json(customers)),
  http.get("/api/customers/:id", ({ params }) => {
    const customer = customers.find((candidate) => candidate.id === params.id)
    return customer
      ? HttpResponse.json(customer)
      : new HttpResponse(null, { status: 404 })
  }),
]
