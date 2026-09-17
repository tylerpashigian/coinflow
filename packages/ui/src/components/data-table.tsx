import {
  createSortedRowModel,
  rowSortingFeature,
  tableFeatures,
  useTable,
  type ColumnDef,
  type SortingState,
  type Updater,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table"

const dataTableFeatures = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
})

type DataTableProps<TData extends Record<string, unknown>> = {
  ariaLabel: string
  columns: ReadonlyArray<ColumnDef<typeof dataTableFeatures, TData, unknown>>
  data: ReadonlyArray<TData>
  emptyMessage?: string
  getRowId?: (originalRow: TData, index: number) => string
  initialSorting?: SortingState
  onRowClick?: (row: TData) => void
  onSortingChange?: (updater: Updater<SortingState>) => void
  sorting?: SortingState
}

function DataTable<TData extends Record<string, unknown>>({
  ariaLabel,
  columns,
  data,
  emptyMessage = "No records found.",
  getRowId,
  initialSorting,
  onRowClick,
  onSortingChange,
  sorting,
}: DataTableProps<TData>) {
  const isSortingControlled =
    sorting !== undefined && onSortingChange !== undefined
  const sortingOptions = isSortingControlled
    ? { onSortingChange, state: { sorting } }
    : {}

  const table = useTable({
    columns,
    data,
    features: dataTableFeatures,
    getRowId,
    initialState: initialSorting ? { sorting: initialSorting } : undefined,
    ...sortingOptions,
  })

  const rows = table.getRowModel().rows

  return (
    <Table aria-label={ariaLabel}>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              const canSort = header.column.getCanSort()
              const sortDirection = header.column.getIsSorted()

              return (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : canSort ? (
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 text-left hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <table.FlexRender header={header} />
                      <span aria-hidden="true">
                        {sortDirection === "asc"
                          ? "↑"
                          : sortDirection === "desc"
                            ? "↓"
                            : "↕"}
                      </span>
                    </button>
                  ) : (
                    <table.FlexRender header={header} />
                  )}
                </TableHead>
              )
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {rows.length ? (
          rows.map((row) => (
            <TableRow
              key={row.id}
              className={onRowClick ? "cursor-pointer" : undefined}
              tabIndex={onRowClick ? 0 : undefined}
              onClick={onRowClick ? () => onRowClick(row.original) : undefined}
              onKeyDown={
                onRowClick
                  ? (event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault()
                        onRowClick(row.original)
                      }
                    }
                  : undefined
              }
            >
              {row.getAllCells().map((cell) => (
                <TableCell key={cell.id}>
                  <table.FlexRender cell={cell} />
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={columns.length}
              className="h-24 text-center text-muted-foreground"
            >
              {emptyMessage}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

export { DataTable }
export type { DataTableProps }
