import { Outlet, useMatch, useNavigate } from "@tanstack/react-router"
import { CustomersPage } from "@/pages/customers-page"
import { PurchasesPage } from "@/pages/purchases-page"

export function PurchasesRoutePage() {
  const navigate = useNavigate()
  const selectedPayment = useMatch({
    from: "/purchases/$paymentId",
    shouldThrow: false,
    select: (match) => match.loaderData,
  })

  return (
    <>
      <PurchasesPage
        selectedPayment={selectedPayment}
        onCloseDetail={() => navigate({ to: "/purchases" })}
        onSelectPayment={(payment) =>
          navigate({
            to: "/purchases/$paymentId",
            params: { paymentId: payment.id },
          })
        }
      />
      <Outlet />
    </>
  )
}

export function CustomersRoutePage() {
  const navigate = useNavigate()
  const selectedCustomer = useMatch({
    from: "/customers/$customerId",
    shouldThrow: false,
    select: (match) => match.loaderData,
  })

  return (
    <>
      <CustomersPage
        selectedCustomer={selectedCustomer}
        onCloseDetail={() => navigate({ to: "/customers" })}
        onSelectCustomer={(customer) =>
          navigate({
            to: "/customers/$customerId",
            params: { customerId: customer.id },
          })
        }
      />
      <Outlet />
    </>
  )
}
