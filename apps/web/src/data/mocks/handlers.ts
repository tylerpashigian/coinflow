import { http, HttpResponse } from "msw"
import { userBuilder } from "@/data/mocks/builders/user-builder"
import { dashboardOverview } from "@/data/mocks/fixtures/dashboard"
import { mockStore, nextMockAction } from "@/data/mocks/store"

export const handlers = [
  http.get("/api/user", () => HttpResponse.json(userBuilder().build())),
  http.get("/api/dashboard/overview", ({ request }) => {
    const rangeLabel =
      new URL(request.url).searchParams.get("from") === "2026-08-17"
        ? "Aug 17 – Aug 23, 2026"
        : dashboardOverview.rangeLabel
    return HttpResponse.json({ ...dashboardOverview, rangeLabel })
  }),
  http.get("/api/payments", () => HttpResponse.json(mockStore.payments)),
  http.get("/api/payments/:id", ({ params }) => {
    const payment = mockStore.payments.find(
      (candidate) => candidate.id === params.id
    )
    return payment
      ? HttpResponse.json(payment)
      : new HttpResponse(null, { status: 404 })
  }),
  http.get("/api/customers", () => HttpResponse.json(mockStore.customers)),
  http.get("/api/customers/:id", ({ params }) => {
    const customer = mockStore.customers.find(
      (candidate) => candidate.id === params.id
    )
    return customer
      ? HttpResponse.json(customer)
      : new HttpResponse(null, { status: 404 })
  }),
  http.post("/api/payments/:id/refund", ({ params }) => {
    const payment = mockStore.payments.find(
      (candidate) => candidate.id === params.id
    )
    if (!payment) return new HttpResponse(null, { status: 404 })
    payment.status = "refunded"
    payment.events.unshift({
      ...nextMockAction("evt_refund", payment.id),
      type: "payment",
      title: "Refund requested",
      actor: "operator",
    })
    return HttpResponse.json(payment)
  }),
  http.post("/api/payments/:id/fraud-report", ({ params }) => {
    const payment = mockStore.payments.find(
      (candidate) => candidate.id === params.id
    )
    if (!payment) return new HttpResponse(null, { status: 404 })
    payment.reviewState = "flagged"
    payment.events.unshift({
      ...nextMockAction("evt_fraud", payment.id),
      type: "review",
      title: "Payment flagged for review",
      actor: "operator",
    })
    return HttpResponse.json(payment)
  }),
  http.patch("/api/customers/:id/block", async ({ params, request }) => {
    const customer = mockStore.customers.find(
      (candidate) => candidate.id === params.id
    )
    if (!customer) return new HttpResponse(null, { status: 404 })
    const body: unknown = await request.json().catch(() => undefined)
    if (
      !body ||
      typeof body !== "object" ||
      typeof (body as { blocked?: unknown }).blocked !== "boolean"
    ) {
      return HttpResponse.json(
        { message: "Blocked must be a boolean" },
        { status: 400 }
      )
    }
    customer.blocked = (body as { blocked: boolean }).blocked
    customer.activities.unshift({
      ...nextMockAction("evt_block", customer.id),
      type: "customer",
      title: customer.blocked ? "Customer blocked" : "Customer unblocked",
      actor: "operator",
    })
    return HttpResponse.json(customer)
  }),
  http.post("/api/customers/:id/verification-requests", ({ params }) => {
    const customer = mockStore.customers.find(
      (candidate) => candidate.id === params.id
    )
    if (!customer) return new HttpResponse(null, { status: 404 })
    customer.verification = "pending"
    customer.activities.unshift({
      ...nextMockAction("evt_verify", customer.id),
      type: "verification",
      title: "Verification requested",
      actor: "operator",
    })
    return HttpResponse.json(customer)
  }),
  http.post("/api/customers/:id/notes", async ({ params, request }) => {
    const customer = mockStore.customers.find(
      (candidate) => candidate.id === params.id
    )
    if (!customer) return new HttpResponse(null, { status: 404 })
    const body = (await request.json()) as { body?: string }
    const note = body.body?.trim()
    if (!note)
      return HttpResponse.json(
        { message: "A note is required" },
        { status: 400 }
      )
    const action = nextMockAction("note", customer.id)
    customer.notes = [
      { id: action.id, body: note, createdAt: action.occurredAt },
      ...customer.notes,
    ]
    customer.activities.unshift({
      ...nextMockAction("evt_note", customer.id),
      type: "note",
      title: "Internal note added",
      detail: note,
      actor: "operator",
    })
    return HttpResponse.json(customer)
  }),
]
