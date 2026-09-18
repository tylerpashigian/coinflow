import { useState } from "react"
import { Checkbox } from "../private/checkbox"
import { cn } from "cn"
import { Badge, type BadgeVariant } from "./badge"

export interface TableCellValue {
  text: string
  sortValue?: string | number
  badge?: BadgeVariant
}
export interface TableColumn {
  id: string
  label: string
  sortable?: boolean
  initialDirection?: "ascending" | "descending"
  align?: "left" | "center" | "right"
}
export interface TableRowData {
  id: string
  cells: readonly TableCellValue[]
  disabled?: boolean
}
export interface TableSort {
  column: string
  direction: "ascending" | "descending"
}
export interface DataTableProps {
  ariaLabel: string
  columns: readonly TableColumn[]
  rows: readonly TableRowData[]
  density?: "compact" | "comfortable"
  emptyMessage?: string
  onRowActivate?: (id: string) => void
  sorting?: TableSort | null
  defaultSorting?: TableSort
  onSortingChange?: (sorting: TableSort | null) => void
  selection?: "none" | "single" | "multiple"
  selectedIds?: readonly string[]
  defaultSelectedIds?: readonly string[]
  onSelectionChange?: (ids: string[]) => void
  "data-testid"?: string
}

export function DataTable({
  ariaLabel,
  columns,
  rows,
  density = "comfortable",
  emptyMessage = "No records found.",
  onRowActivate,
  sorting,
  defaultSorting,
  onSortingChange,
  selection = "none",
  selectedIds,
  defaultSelectedIds = [],
  onSelectionChange,
  "data-testid": testId,
}: DataTableProps) {
  const [localSort, setLocalSort] = useState<TableSort | null>(
    defaultSorting ?? null
  )
  const [localSelection, setLocalSelection] =
    useState<readonly string[]>(defaultSelectedIds)
  const sort = sorting === undefined ? localSort : sorting
  const selected = selectedIds ?? localSelection
  const columnIndex = sort
    ? columns.findIndex((column) => column.id === sort.column)
    : -1
  const visibleRows =
    columnIndex < 0
      ? rows
      : [...rows].sort((a, b) => {
          const av =
            a.cells[columnIndex]?.sortValue ?? a.cells[columnIndex]?.text ?? ""
          const bv =
            b.cells[columnIndex]?.sortValue ?? b.cells[columnIndex]?.text ?? ""
          const result =
            typeof av === "number" && typeof bv === "number"
              ? av - bv
              : String(av).localeCompare(String(bv))
          return sort?.direction === "descending" ? -result : result
        })
  const toggleSort = (column: TableColumn) => {
    const first = column.initialDirection ?? "ascending"
    const next: TableSort | null =
      sort?.column !== column.id
        ? { column: column.id, direction: first }
        : sort.direction === first
          ? {
              column: column.id,
              direction: first === "ascending" ? "descending" : "ascending",
            }
          : null
    setLocalSort(next)
    onSortingChange?.(next)
  }
  const toggleSelection = (row: TableRowData) => {
    const next = selected.includes(row.id)
      ? selected.filter((id) => id !== row.id)
      : selection === "single"
        ? [row.id]
        : [...selected, row.id]
    setLocalSelection(next)
    onSelectionChange?.(next)
  }
  return (
    <div
      className="relative w-full overflow-x-auto rounded-xl border border-border bg-card shadow-sm"
      data-testid={testId}
    >
      <table aria-label={ariaLabel} className="w-full caption-bottom text-sm">
        <thead className="border-b bg-muted/35">
          <tr>
            {selection !== "none" && (
              <th scope="col" className="px-4">
                <span className="sr-only">Selection</span>
              </th>
            )}
            {columns.map((column) => (
              <th
                key={column.id}
                scope="col"
                aria-sort={
                  sort?.column === column.id
                    ? sort.direction
                    : column.sortable === false
                      ? undefined
                      : "none"
                }
                className={cn(
                  "h-11 px-4 text-[0.6875rem] font-semibold whitespace-nowrap text-muted-foreground",
                  column.align === "right"
                    ? "text-right"
                    : column.align === "center"
                      ? "text-center"
                      : "text-left"
                )}
              >
                {column.sortable === false ? (
                  column.label
                ) : (
                  <button
                    type="button"
                    onClick={() => toggleSort(column)}
                    className="inline-flex items-center gap-1 hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                  >
                    {column.label}
                    <span aria-hidden="true">
                      {sort?.column === column.id
                        ? sort.direction === "ascending"
                          ? "↑"
                          : "↓"
                        : "↕"}
                    </span>
                  </button>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visibleRows.length ? (
            visibleRows.map((row) => (
              <tr
                key={row.id}
                aria-selected={
                  selection !== "none" ? selected.includes(row.id) : undefined
                }
                tabIndex={onRowActivate && !row.disabled ? 0 : undefined}
                aria-disabled={row.disabled || undefined}
                onClick={() => {
                  if (!row.disabled) onRowActivate?.(row.id)
                }}
                onKeyDown={(event) => {
                  if (
                    event.target === event.currentTarget &&
                    !row.disabled &&
                    onRowActivate &&
                    (event.key === "Enter" || event.key === " ")
                  ) {
                    event.preventDefault()
                    onRowActivate(row.id)
                  }
                }}
                className={cn(
                  "border-b border-border/70 transition-colors last:border-0 hover:bg-muted/65 focus-visible:outline-2 focus-visible:outline-ring",
                  onRowActivate && !row.disabled && "cursor-pointer",
                  selected.includes(row.id) && "bg-muted",
                  row.disabled && "opacity-50"
                )}
              >
                {selection !== "none" && (
                  <td
                    className="px-4"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <Checkbox
                      aria-label={`Select ${row.id}`}
                      checked={selected.includes(row.id)}
                      disabled={row.disabled}
                      onCheckedChange={() => toggleSelection(row)}
                    />
                  </td>
                )}
                {columns.map((column, index) => (
                  <td
                    key={column.id}
                    className={cn(
                      "px-4 align-middle whitespace-nowrap",
                      density === "compact" ? "py-2" : "py-3",
                      column.align === "right"
                        ? "text-right"
                        : column.align === "center"
                          ? "text-center"
                          : "text-left"
                    )}
                  >
                    {row.cells[index]?.badge ? (
                      <Badge variant={row.cells[index].badge}>
                        {row.cells[index].text}
                      </Badge>
                    ) : (
                      row.cells[index]?.text
                    )}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length + (selection === "none" ? 0 : 1)}
                className="h-24 text-center text-muted-foreground"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
