import { useEffect, useId, useRef, useState, type ReactNode } from "react"
import * as Primitive from "../private/table"
import { cn } from "cn"

type Alignment = "left" | "center" | "right"
type Density = "compact" | "comfortable"
type RowState = "default" | "active"

function alignmentClassName(align: Alignment) {
  return align === "right"
    ? "text-right"
    : align === "center"
      ? "text-center"
      : "text-left"
}

export interface TableProps {
  children: ReactNode
  /** Accessible name for the table. */
  ariaLabel: string
  /** Announces a visible overflow hint when the table needs horizontal scrolling. */
  overflowHint?: string
  /** Applies the bordered card surface used by data-rich views. */
  surface?: "plain" | "card"
  "data-testid"?: string
}

export function Table({
  children,
  ariaLabel,
  overflowHint,
  surface = "plain",
  "data-testid": testId,
}: TableProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const overflowHintId = useId()
  const [hasHorizontalOverflow, setHasHorizontalOverflow] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container || !overflowHint) return

    const updateOverflow = () =>
      setHasHorizontalOverflow(
        container.scrollWidth > container.clientWidth + 1
      )

    updateOverflow()
    const observer =
      typeof ResizeObserver === "undefined"
        ? undefined
        : new ResizeObserver(updateOverflow)
    observer?.observe(container)
    window.addEventListener("resize", updateOverflow)

    return () => {
      observer?.disconnect()
      window.removeEventListener("resize", updateOverflow)
    }
  }, [overflowHint])

  return (
    <div
      data-testid={testId}
      className={cn(
        "w-full",
        surface === "card" &&
          "overflow-hidden rounded-xl border border-border bg-card"
      )}
    >
      <Primitive.Table
        containerRef={containerRef}
        aria-label={ariaLabel}
        aria-describedby={hasHorizontalOverflow ? overflowHintId : undefined}
        className="text-sm"
      >
        {children}
      </Primitive.Table>
      {hasHorizontalOverflow && overflowHint ? (
        <p
          className="sticky left-0 border-t border-border/80 bg-muted/45 px-4 py-2.5 text-xs text-muted-foreground"
          id={overflowHintId}
        >
          {overflowHint}
        </p>
      ) : null}
    </div>
  )
}

export interface TableCaptionProps {
  children: ReactNode
}

export function TableCaption({ children }: TableCaptionProps) {
  return <Primitive.TableCaption>{children}</Primitive.TableCaption>
}

export interface TableHeaderProps {
  children: ReactNode
}

export function TableHeader({ children }: TableHeaderProps) {
  return (
    <Primitive.TableHeader className="border-b border-border bg-muted/45">
      {children}
    </Primitive.TableHeader>
  )
}

export interface TableBodyProps {
  children: ReactNode
}

export function TableBody({ children }: TableBodyProps) {
  return <Primitive.TableBody>{children}</Primitive.TableBody>
}

export interface TableFooterProps {
  children: ReactNode
}

export function TableFooter({ children }: TableFooterProps) {
  return <Primitive.TableFooter>{children}</Primitive.TableFooter>
}

export interface TableRowProps {
  children: ReactNode
  disabled?: boolean
  interactive?: boolean
  onPress?: () => void
  selected?: boolean
  state?: RowState
}

export function TableRow({
  children,
  disabled = false,
  interactive = false,
  onPress,
  selected,
  state = "default",
}: TableRowProps) {
  const canActivate = interactive && !disabled && onPress !== undefined

  return (
    <Primitive.TableRow
      aria-disabled={disabled || undefined}
      aria-selected={selected}
      data-state={state === "active" ? "active" : undefined}
      tabIndex={canActivate ? 0 : undefined}
      onClick={canActivate ? onPress : undefined}
      onKeyDown={
        canActivate
          ? (event) => {
              if (
                event.target === event.currentTarget &&
                (event.key === "Enter" || event.key === " ")
              ) {
                event.preventDefault()
                onPress()
              }
            }
          : undefined
      }
      className={cn(
        "border-b border-border/80 transition-colors last:border-0 hover:bg-muted/70 focus-visible:outline-2 focus-visible:outline-ring",
        canActivate && "cursor-pointer",
        selected && "bg-muted",
        state === "active" &&
          "bg-accent text-accent-foreground ring-1 ring-ring/30 ring-inset",
        disabled && "opacity-50"
      )}
    >
      {children}
    </Primitive.TableRow>
  )
}

export interface TableHeadProps {
  children: ReactNode
  align?: Alignment
  pinned?: boolean
  /** Reserves the fixed-width leading column used by selection controls. */
  selection?: boolean
  sort?: "ascending" | "descending" | "none"
}

export function TableHead({
  children,
  align = "left",
  pinned = false,
  selection = false,
  sort,
}: TableHeadProps) {
  return (
    <Primitive.TableHead
      scope="col"
      aria-sort={sort}
      className={cn(
        "h-11 px-4 text-[0.6875rem] font-semibold tracking-wide whitespace-nowrap text-muted-foreground",
        pinned && "sticky left-0 z-20 border-r border-border/70 bg-muted",
        selection && "!w-12 !max-w-12 !min-w-12 !px-0",
        alignmentClassName(align)
      )}
    >
      {children}
    </Primitive.TableHead>
  )
}

export interface TableCellProps {
  children: ReactNode
  align?: Alignment
  colSpan?: number
  density?: Density
  empty?: boolean
  pinned?: boolean
  rowState?: RowState
  selected?: boolean
  /** Reserves the fixed-width leading column used by selection controls. */
  selection?: boolean
}

export function TableCell({
  children,
  align = "left",
  colSpan,
  density = "comfortable",
  empty = false,
  pinned = false,
  rowState = "default",
  selected = false,
  selection = false,
}: TableCellProps) {
  return (
    <Primitive.TableCell
      colSpan={colSpan}
      className={cn(
        "px-4 align-middle whitespace-nowrap",
        density === "compact" ? "py-2.5" : "py-3.5",
        empty && "h-24 text-muted-foreground",
        pinned && "sticky left-0 z-10 border-r border-border/70",
        selection && "!w-12 !max-w-12 !min-w-12 !px-0",
        pinned &&
          (rowState === "active"
            ? "bg-accent"
            : selected
              ? "bg-muted"
              : "bg-card"),
        alignmentClassName(align)
      )}
    >
      {children}
    </Primitive.TableCell>
  )
}
