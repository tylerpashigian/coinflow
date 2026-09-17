import {
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router"
import { AppShell } from "@/components/app-shell"
import {
  CustomersRoutePage,
  PurchasesRoutePage,
} from "@/components/operations-route-pages"
import { DashboardPage } from "@/pages/dashboard-page"
import { getCustomer } from "@/services/customers-service"
import { getPayment } from "@/services/payments-service"

const rootRoute = createRootRoute({
  component: () => (
    <AppShell>
      <Outlet />
    </AppShell>
  ),
})
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: DashboardPage,
})
const purchasesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "purchases",
  component: PurchasesRoutePage,
})
const customersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "customers",
  component: CustomersRoutePage,
})
const purchasesIndexRoute = createRoute({
  getParentRoute: () => purchasesRoute,
  path: "/",
})
const purchaseDetailRoute = createRoute({
  getParentRoute: () => purchasesRoute,
  path: "$paymentId",
  params: {
    parse: ({ paymentId }) => {
      if (!/^pay_[A-Za-z0-9]+$/.test(paymentId)) {
        throw new Error("Invalid payment ID")
      }
      return { paymentId }
    },
    stringify: ({ paymentId }) => ({ paymentId }),
  },
  loader: async ({ params }) => {
    try {
      return await getPayment(params.paymentId)
    } catch {
      return null
    }
  },
})
const customersIndexRoute = createRoute({
  getParentRoute: () => customersRoute,
  path: "/",
})
const customerDetailRoute = createRoute({
  getParentRoute: () => customersRoute,
  path: "$customerId",
  params: {
    parse: ({ customerId }) => {
      if (!/^cus_[A-Za-z0-9]+$/.test(customerId)) {
        throw new Error("Invalid customer ID")
      }
      return { customerId }
    },
    stringify: ({ customerId }) => ({ customerId }),
  },
  loader: async ({ params }) => {
    try {
      return await getCustomer(params.customerId)
    } catch {
      return null
    }
  },
})

export const router = createRouter({
  routeTree: rootRoute.addChildren([
    dashboardRoute,
    purchasesRoute.addChildren([purchasesIndexRoute, purchaseDetailRoute]),
    customersRoute.addChildren([customersIndexRoute, customerDetailRoute]),
  ]),
})

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}
