import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { Toolbar, type ToolbarItem } from "@workspace/ui/components/toolbar"

describe("Toolbar", () => {
  it("renders controlled contextual actions with an accessible summary", () => {
    const onClear = vi.fn()
    const items: readonly ToolbarItem[] = [
      {
        id: "clear",
        icon: "close",
        label: "Clear selection",
        onPress: onClear,
      },
    ]
    const { rerender } = render(
      <Toolbar
        ariaLabel="Bulk actions"
        items={items}
        open={false}
        summary="1 customer selected"
      />
    )

    expect(screen.queryByRole("toolbar", { name: "Bulk actions" })).toBeNull()

    rerender(
      <Toolbar
        ariaLabel="Bulk actions"
        items={items}
        open
        summary="1 customer selected"
      />
    )

    expect(screen.getByRole("toolbar", { name: "Bulk actions" })).toBeVisible()
    expect(screen.getByText("1 customer selected")).toBeVisible()
    fireEvent.click(screen.getByRole("button", { name: "Clear selection" }))
    expect(onClear).toHaveBeenCalledOnce()
  })

  it("accepts changed action sets and preserves disabled destructive actions", () => {
    const items: readonly ToolbarItem[] = [
      {
        id: "clear",
        icon: "close",
        label: "Clear selection",
        onPress: vi.fn(),
      },
    ]
    const destructiveItems: readonly ToolbarItem[] = [
      ...items,
      {
        id: "remove",
        disabled: true,
        icon: "trash",
        label: "Remove selected customers",
        onPress: vi.fn(),
        tone: "destructive",
      },
    ]
    const { rerender } = render(
      <Toolbar
        ariaLabel="Bulk actions"
        items={items}
        open
        summary="1 selected"
      />
    )

    rerender(
      <Toolbar
        ariaLabel="Bulk actions"
        items={destructiveItems}
        open
        summary="2 selected"
      />
    )

    expect(screen.getByText("2 selected")).toBeVisible()
    expect(
      screen.getByRole("button", { name: "Remove selected customers" })
    ).toBeDisabled()
  })
})
