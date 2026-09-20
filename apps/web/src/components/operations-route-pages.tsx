import {
  Outlet,
  useMatch,
  useNavigate,
  useSearch,
} from "@tanstack/react-router"
import { CustomersPage } from "@/pages/customers-page"
import { PurchasesPage } from "@/pages/purchases-page"

export function PurchasesRoutePage() {
  const navigate = useNavigate()
  const { customerId } = useSearch({ from: "/purchases" })
  const selectedPayment = useMatch({
    from: "/purchases/$paymentId",
    shouldThrow: false,
    select: (match) => match.loaderData,
  })

  return (
    <>
      <PurchasesPage
        customerId={customerId}
        selectedPayment={selectedPayment}
        onCloseDetail={() =>
          navigate({ to: "/purchases", search: { customerId } })
        }
        onSelectPayment={(payment) =>
          navigate({
            to: "/purchases/$paymentId",
            params: { paymentId: payment.id },
            search: { customerId },
          })
        }
        onViewCustomer={(customerId) =>
          navigate({
            to: "/customers/$customerId",
            params: { customerId },
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
        onViewRelatedPayments={(customer) =>
          navigate({
            to: "/purchases",
            search: { customerId: customer.id },
          })
        }
      />
      <Outlet />
    </>
  )
}
