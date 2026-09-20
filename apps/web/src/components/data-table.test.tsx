import { fireEvent, render, screen, within } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import {
  DataTable,
  type TableColumn,
  type TableRowData,
} from "@workspace/ui/components/data-table"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"

const columns: readonly TableColumn[] = [
  { id: "name", label: "Name" },
  {
    id: "amount",
    label: "Amount",
    align: "right",
    initialDirection: "descending",
  },
  { id: "status", label: "Status", sortable: false },
]

const rows: readonly TableRowData[] = [
  {
    id: "charlie",
    cells: [
      { text: "Charlie" },
      { text: "$2", sortValue: 2 },
      { text: "Open" },
    ],
  },
  {
    id: "alpha",
    cells: [
      { text: "Alpha" },
      { text: "$10", sortValue: 10 },
      { text: "Open" },
    ],
  },
  {
    id: "bravo",
    cells: [{ text: "Bravo" }, { text: "$1", sortValue: 1 }, { text: "Open" }],
  },
]

function renderedRowNames() {
  return screen
    .getAllByRole("row")
    .slice(1)
    .map((row) => within(row).getAllByRole("cell")[0]?.textContent)
}

describe("Table", () => {
  it("renders a composed semantic table and announces actual overflow", () => {
    const { container } = render(
      <Table ariaLabel="Ledger" overflowHint="Scroll for more columns.">
        <TableCaption>Monthly ledger</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>$25</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
    const scrollContainer = container.querySelector(
      '[data-slot="table-container"]'
    ) as HTMLDivElement

    Object.defineProperties(scrollContainer, {
      clientWidth: { configurable: true, value: 100 },
      scrollWidth: { configurable: true, value: 200 },
    })
    fireEvent(window, new Event("resize"))

    const table = screen.getByRole("table", { name: "Ledger" })
    const hint = screen.getByText("Scroll for more columns.")
    expect(screen.getByRole("columnheader", { name: "Amount" })).toBeVisible()
    expect(screen.getByRole("cell", { name: "$25" })).toBeVisible()
    expect(screen.getByText("Monthly ledger")).toBeVisible()
    expect(table).toHaveAttribute("aria-describedby", hint.id)
  })
})

describe("DataTable", () => {
  it("does not render selection controls or selection state without selectType", () => {
    render(<DataTable ariaLabel="Payments" columns={columns} rows={rows} />)

    expect(screen.queryByRole("checkbox")).toBeNull()
    expect(screen.getByText("Alpha").closest("tr")).not.toHaveAttribute(
      "aria-selected"
    )
  })

  it("uses TanStack sorting while preserving the current sort cycle and comparator", () => {
    render(
      <DataTable
        ariaLabel="Payments"
        columns={columns}
        rows={rows}
        defaultSorting={{ column: "amount", direction: "descending" }}
      />
    )

    expect(renderedRowNames()).toEqual(["Alpha", "Charlie", "Bravo"])
    expect(
      screen.getByRole("columnheader", { name: /Amount/ })
    ).toHaveAttribute("aria-sort", "descending")

    fireEvent.click(screen.getByRole("button", { name: /Name/ }))
    expect(renderedRowNames()).toEqual(["Alpha", "Bravo", "Charlie"])
    expect(screen.getByRole("columnheader", { name: /Name/ })).toHaveAttribute(
      "aria-sort",
      "ascending"
    )

    fireEvent.click(screen.getByRole("button", { name: /Name/ }))
    expect(renderedRowNames()).toEqual(["Charlie", "Bravo", "Alpha"])

    fireEvent.click(screen.getByRole("button", { name: /Name/ }))
    expect(renderedRowNames()).toEqual(["Charlie", "Alpha", "Bravo"])
    expect(screen.getByRole("columnheader", { name: /Name/ })).toHaveAttribute(
      "aria-sort",
      "none"
    )
    expect(screen.queryByRole("button", { name: /Status/ })).toBeNull()
  })

  it("keeps controlled sorting controlled while reporting the requested next sort", () => {
    const onSortingChange = vi.fn()
    const { rerender } = render(
      <DataTable
        ariaLabel="Payments"
        columns={columns}
        rows={rows}
        sorting={null}
        onSortingChange={onSortingChange}
      />
    )

    fireEvent.click(screen.getByRole("button", { name: /Name/ }))
    expect(onSortingChange).toHaveBeenCalledWith({
      column: "name",
      direction: "ascending",
    })
    expect(renderedRowNames()).toEqual(["Charlie", "Alpha", "Bravo"])

    rerender(
      <DataTable
        ariaLabel="Payments"
        columns={columns}
        rows={rows}
        sorting={{ column: "name", direction: "ascending" }}
        onSortingChange={onSortingChange}
      />
    )
    expect(renderedRowNames()).toEqual(["Alpha", "Bravo", "Charlie"])
  })

  it("supports uncontrolled single selection and constrains defaults to one ID", () => {
    const onSelectionChange = vi.fn()
    render(
      <DataTable
        ariaLabel="Payments"
        columns={columns}
        rows={rows}
        selectType="single"
        defaultSelectedIds={["alpha", "bravo"]}
        onSelectionChange={onSelectionChange}
      />
    )

    expect(
      screen.getByRole("checkbox", { name: "Select alpha" })
    ).toHaveAttribute("aria-checked", "true")
    expect(
      screen.getByRole("checkbox", { name: "Select bravo" })
    ).toHaveAttribute("aria-checked", "false")
    expect(
      screen.queryByRole("checkbox", { name: "Select all rows" })
    ).toBeNull()

    fireEvent.click(screen.getByRole("checkbox", { name: "Select bravo" }))
    expect(onSelectionChange).toHaveBeenLastCalledWith(["bravo"])
    expect(
      screen.getByRole("checkbox", { name: "Select alpha" })
    ).toHaveAttribute("aria-checked", "false")
  })

  it("keeps controlled multi-selection controlled while reporting requested IDs", () => {
    const onSelectionChange = vi.fn()
    render(
      <DataTable
        ariaLabel="Payments"
        columns={columns}
        rows={rows}
        selectType="multi"
        selectedIds={["alpha"]}
        onSelectionChange={onSelectionChange}
      />
    )

    fireEvent.click(screen.getByRole("checkbox", { name: "Select bravo" }))
    expect(onSelectionChange).toHaveBeenLastCalledWith(["alpha", "bravo"])
    expect(
      screen.getByRole("checkbox", { name: "Select bravo" })
    ).toHaveAttribute("aria-checked", "false")
  })

  it("selects all selectable rows with a tri-state multi-select header", () => {
    const onSelectionChange = vi.fn()
    const rowsWithDisabled = rows.map((row) =>
      row.id === "bravo" ? { ...row, disabled: true } : row
    )
    render(
      <DataTable
        ariaLabel="Payments"
        columns={columns}
        rows={rowsWithDisabled}
        selectType="multi"
        onSelectionChange={onSelectionChange}
      />
    )

    const selectAll = screen.getByRole("checkbox", { name: "Select all rows" })
    fireEvent.click(screen.getByRole("checkbox", { name: "Select alpha" }))
    expect(selectAll).toHaveAttribute("aria-checked", "mixed")

    fireEvent.click(selectAll)
    expect(onSelectionChange).toHaveBeenLastCalledWith(["charlie", "alpha"])
    expect(
      screen.getByRole("checkbox", { name: "Select bravo" })
    ).toBeDisabled()

    fireEvent.click(selectAll)
    expect(onSelectionChange).toHaveBeenLastCalledWith([])
  })

  it("uses one fixed-width column for header and row selection controls", () => {
    render(
      <DataTable
        ariaLabel="Payments"
        columns={columns}
        rows={rows}
        selectType="multi"
      />
    )

    const selectionHeader = screen
      .getByRole("checkbox", { name: "Select all rows" })
      .closest("th")
    const selectionCell = screen
      .getByRole("checkbox", { name: "Select alpha" })
      .closest("td")

    expect(selectionHeader).toHaveClass("!w-12", "!min-w-12", "!max-w-12")
    expect(selectionCell).toHaveClass("!w-12", "!min-w-12", "!max-w-12")
  })

  it("retains externally selected disabled IDs across sorting", () => {
    const rowsWithDisabled = rows.map((row) =>
      row.id === "bravo" ? { ...row, disabled: true } : row
    )
    render(
      <DataTable
        ariaLabel="Payments"
        columns={columns}
        rows={rowsWithDisabled}
        selectType="multi"
        selectedIds={["bravo"]}
      />
    )

    const bravoCheckbox = screen.getByRole("checkbox", { name: "Select bravo" })
    expect(bravoCheckbox).toHaveAttribute("aria-checked", "true")
    expect(bravoCheckbox).toBeDisabled()
    expect(screen.getByText("Bravo").closest("tr")).toHaveAttribute(
      "aria-selected",
      "true"
    )

    fireEvent.click(screen.getByRole("button", { name: /Name/ }))
    expect(
      screen.getByRole("checkbox", { name: "Select bravo" })
    ).toHaveAttribute("aria-checked", "true")
  })

  it("supports active, pinned, keyboard-activated rows and ignores disabled rows", () => {
    const onRowActivate = vi.fn()
    const rowsWithDisabled = rows.map((row) =>
      row.id === "bravo" ? { ...row, disabled: true } : row
    )
    render(
      <DataTable
        ariaLabel="Payments"
        columns={columns}
        rows={rowsWithDisabled}
        activeRowId="alpha"
        onRowActivate={onRowActivate}
        pinLeadingColumn
      />
    )

    const alphaRow = screen.getByText("Alpha").closest("tr")
    const bravoRow = screen.getByText("Bravo").closest("tr")
    expect(alphaRow).toHaveAttribute("data-state", "active")
    expect(
      within(alphaRow as HTMLTableRowElement).getAllByRole("cell")[0]
    ).toHaveClass("sticky", "bg-accent")

    fireEvent.click(alphaRow as HTMLTableRowElement)
    fireEvent.keyDown(alphaRow as HTMLTableRowElement, { key: "Enter" })
    fireEvent.click(bravoRow as HTMLTableRowElement)
    fireEvent.keyDown(bravoRow as HTMLTableRowElement, { key: " " })

    expect(onRowActivate).toHaveBeenCalledTimes(2)
    expect(onRowActivate).toHaveBeenCalledWith("alpha")
    expect(bravoRow).toHaveAttribute("aria-disabled", "true")
  })

  it("keeps checkbox selection separate from row activation and prioritizes active styling", () => {
    const onRowActivate = vi.fn()
    render(
      <DataTable
        ariaLabel="Payments"
        columns={columns}
        rows={rows}
        selectType="multi"
        selectedIds={["alpha"]}
        activeRowId="alpha"
        onRowActivate={onRowActivate}
        pinLeadingColumn
      />
    )

    const alphaRow = screen.getByText("Alpha").closest("tr")
    expect(alphaRow).toHaveAttribute("aria-selected", "true")
    expect(alphaRow).toHaveClass("bg-muted", "bg-accent")
    expect(
      within(alphaRow as HTMLTableRowElement).getAllByRole("cell")[1]
    ).toHaveClass("bg-accent")

    fireEvent.click(screen.getByRole("checkbox", { name: "Select alpha" }))
    expect(onRowActivate).not.toHaveBeenCalled()
  })

  it("renders the configured empty message", () => {
    render(
      <DataTable
        ariaLabel="Payments"
        columns={columns}
        rows={[]}
        emptyMessage="No payments yet."
      />
    )

    expect(screen.getByText("No payments yet.")).toBeVisible()
  })
})
