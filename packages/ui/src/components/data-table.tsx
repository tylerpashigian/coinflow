import { useMemo, useState } from "react"
import {
  createSortedRowModel,
  rowSelectionFeature,
  rowSortingFeature,
  tableFeatures,
  useTable,
  type ColumnDef,
  type RowSelectionState,
  type SortingState,
  type Updater,
} from "@tanstack/react-table"
import { Badge, type BadgeVariant } from "./badge"
import { Checkbox } from "../private/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table"

const dataTableFeatures = tableFeatures({
  rowSelectionFeature,
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
})

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
  /** Enables checkbox row selection. */
  selectType?: "single" | "multi"
  /** Controlled selected row IDs. */
  selectedIds?: readonly string[]
  /** Initial selected row IDs when selection is uncontrolled. */
  defaultSelectedIds?: readonly string[]
  /** Called with selected row IDs in the current table order. */
  onSelectionChange?: (ids: string[]) => void
  /** Highlights the record currently open in contextual detail. */
  activeRowId?: string
  /** Keeps the leading context column visible while a wide table scrolls. */
  pinLeadingColumn?: boolean
  /** Announces horizontal overflow only when it is actually present. */
  overflowHint?: string
  "data-testid"?: string
}

function toSortingState(sorting: TableSort | null): SortingState {
  return sorting
    ? [{ id: sorting.column, desc: sorting.direction === "descending" }]
    : []
}

function toTableSort(sorting: SortingState): TableSort | null {
  const [first] = sorting
  return first
    ? {
        column: first.id,
        direction: first.desc ? "descending" : "ascending",
      }
    : null
}

function toRowSelectionState(
  ids: readonly string[],
  selectType: DataTableProps["selectType"]
): RowSelectionState {
  if (!selectType) return {}

  const selection: RowSelectionState = {}
  for (const id of ids) {
    selection[id] = true
    if (selectType === "single") break
  }
  return selection
}

function toSelectedIds(
  selection: RowSelectionState,
  orderedRowIds: readonly string[]
) {
  const selectedIds = Object.keys(selection).filter((id) => selection[id])
  const selectedIdSet = new Set(selectedIds)
  const orderedIds = orderedRowIds.filter((id) => selectedIdSet.delete(id))
  return [...orderedIds, ...selectedIds.filter((id) => selectedIdSet.has(id))]
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
  selectType,
  selectedIds,
  defaultSelectedIds = [],
  onSelectionChange,
  activeRowId,
  pinLeadingColumn = false,
  overflowHint = "Scroll horizontally to view remaining columns.",
  "data-testid": testId,
}: DataTableProps) {
  const [localSort, setLocalSort] = useState<TableSort | null>(
    defaultSorting ?? null
  )
  const [localSelectedIds, setLocalSelectedIds] = useState<readonly string[]>(
    selectType === "single"
      ? defaultSelectedIds.slice(0, 1)
      : defaultSelectedIds
  )
  const sort = sorting === undefined ? localSort : sorting
  const selected = selectedIds ?? localSelectedIds
  const tanstackSorting = useMemo(() => toSortingState(sort), [sort])
  const tanstackSelection = useMemo(
    () => toRowSelectionState(selected, selectType),
    [selectType, selected]
  )
  const tableColumns = useMemo(
    () =>
      columns.map((column, index) => ({
        id: column.id,
        header: column.label,
        accessorFn: (row: TableRowData) =>
          row.cells[index]?.sortValue ?? row.cells[index]?.text ?? "",
        enableSorting: column.sortable !== false,
        enableMultiSort: false,
        sortDescFirst: column.initialDirection === "descending",
        sortUndefined: false,
        sortFn: (rowA, rowB) => {
          const av =
            rowA.original.cells[index]?.sortValue ??
            rowA.original.cells[index]?.text ??
            ""
          const bv =
            rowB.original.cells[index]?.sortValue ??
            rowB.original.cells[index]?.text ??
            ""
          return typeof av === "number" && typeof bv === "number"
            ? av - bv
            : String(av).localeCompare(String(bv))
        },
      })) satisfies ColumnDef<typeof dataTableFeatures, TableRowData>[],
    [columns]
  )
  const table = useTable({
    columns: tableColumns,
    data: rows,
    enableRowRangeSelection: false,
    enableRowSelection: (row) => Boolean(selectType) && !row.original.disabled,
    enableMultiRowSelection: selectType === "multi",
    enableSubRowSelection: false,
    enableMultiSort: false,
    enableSortingRemoval: true,
    features: dataTableFeatures,
    getRowId: (row) => row.id,
    onSortingChange: (updater: Updater<SortingState>) => {
      const next =
        typeof updater === "function" ? updater(tanstackSorting) : updater
      const nextSort = toTableSort(next)
      if (sorting === undefined) setLocalSort(nextSort)
      onSortingChange?.(nextSort)
    },
    onRowSelectionChange: (updater: Updater<RowSelectionState>) => {
      const next =
        typeof updater === "function" ? updater(tanstackSelection) : updater
      const nextIds = toSelectedIds(
        next,
        table.getRowModel().rows.map((row) => row.id)
      )
      const constrainedIds =
        selectType === "single" ? nextIds.slice(0, 1) : nextIds
      if (selectedIds === undefined) setLocalSelectedIds(constrainedIds)
      onSelectionChange?.(constrainedIds)
    },
    state: { rowSelection: tanstackSelection, sorting: tanstackSorting },
  })

  const hasSelectableRows = table
    .getRowModel()
    .rows.some((row) => row.getCanSelect())

  return (
    <Table
      ariaLabel={ariaLabel}
      overflowHint={overflowHint}
      surface="card"
      data-testid={testId}
    >
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {selectType ? (
              <TableHead align="center" selection>
                {selectType === "multi" ? (
                  <div
                    className="flex justify-center"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <Checkbox
                      aria-label="Select all rows"
                      checked={
                        hasSelectableRows && table.getIsAllRowsSelected()
                      }
                      disabled={!hasSelectableRows}
                      indeterminate={
                        !table.getIsAllRowsSelected() &&
                        table.getIsSomeRowsSelected()
                      }
                      onCheckedChange={(checked) =>
                        table.toggleAllRowsSelected(checked)
                      }
                    />
                  </div>
                ) : (
                  <span className="sr-only">Selection</span>
                )}
              </TableHead>
            ) : null}
            {headerGroup.headers.map((header) => {
              const column = columns.find(
                (candidate) => candidate.id === header.column.id
              )
              const direction = header.column.getIsSorted()

              return (
                <TableHead
                  key={header.id}
                  align={column?.align}
                  pinned={pinLeadingColumn && header.index === 0}
                  sort={
                    direction === "asc"
                      ? "ascending"
                      : direction === "desc"
                        ? "descending"
                        : column?.sortable === false
                          ? undefined
                          : "none"
                  }
                >
                  {column?.sortable === false ? (
                    column.label
                  ) : (
                    <button
                      type="button"
                      onClick={() => header.column.toggleSorting()}
                      className="inline-flex items-center gap-1 hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                    >
                      {column?.label}
                      <span aria-hidden="true">
                        {direction === "asc"
                          ? "↑"
                          : direction === "desc"
                            ? "↓"
                            : "↕"}
                      </span>
                    </button>
                  )}
                </TableHead>
              )
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.length ? (
          table.getRowModel().rows.map((row) => {
            const rowState =
              activeRowId === row.original.id ? "active" : "default"

            return (
              <TableRow
                key={row.id}
                disabled={row.original.disabled}
                interactive={onRowActivate !== undefined}
                onPress={
                  onRowActivate
                    ? () => onRowActivate(row.original.id)
                    : undefined
                }
                selected={selectType ? row.getIsSelected() : undefined}
                state={rowState}
              >
                {selectType ? (
                  <TableCell align="center" density={density} selection>
                    <div
                      className="flex justify-center"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <Checkbox
                        aria-label={`Select ${row.original.id}`}
                        checked={row.getIsSelected()}
                        disabled={!row.getCanSelect()}
                        onCheckedChange={(checked) =>
                          row.toggleSelected(checked)
                        }
                      />
                    </div>
                  </TableCell>
                ) : null}
                {row.getAllCells().map((cell, index) => {
                  const value = row.original.cells[index]

                  return (
                    <TableCell
                      key={cell.id}
                      align={columns[index]?.align}
                      density={density}
                      pinned={pinLeadingColumn && index === 0}
                      rowState={rowState}
                      selected={selectType ? row.getIsSelected() : false}
                    >
                      {value?.badge ? (
                        <Badge variant={value.badge}>{value.text}</Badge>
                      ) : (
                        value?.text
                      )}
                    </TableCell>
                  )
                })}
              </TableRow>
            )
          })
        ) : (
          <TableRow>
            <TableCell
              align="center"
              colSpan={columns.length + (selectType ? 1 : 0)}
              density={density}
              empty
            >
              {emptyMessage}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
