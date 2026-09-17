import { act, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { useStablePending } from "./use-stable-pending"

describe("useStablePending", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("does not show feedback for a request resolved before the pending threshold", () => {
    const { result, rerender } = renderHook(
      ({ isPending }) =>
        useStablePending(isPending, { pendingMs: 200, pendingMinMs: 400 }),
      { initialProps: { isPending: true } }
    )

    act(() => vi.advanceTimersByTime(199))
    expect(result.current).toBe(false)

    rerender({ isPending: false })
    act(() => vi.advanceTimersByTime(500))
    expect(result.current).toBe(false)
  })

  it("shows immediately when pendingMs is zero", () => {
    const { result } = renderHook(() =>
      useStablePending(true, { pendingMs: 0, pendingMinMs: 400 })
    )

    expect(result.current).toBe(true)
  })

  it("keeps visible feedback on screen for its minimum duration", () => {
    const { result, rerender } = renderHook(
      ({ isPending }) =>
        useStablePending(isPending, { pendingMs: 200, pendingMinMs: 400 }),
      { initialProps: { isPending: true } }
    )

    act(() => vi.advanceTimersByTime(200))
    expect(result.current).toBe(true)

    rerender({ isPending: false })
    act(() => vi.advanceTimersByTime(399))
    expect(result.current).toBe(true)

    act(() => vi.advanceTimersByTime(1))
    expect(result.current).toBe(false)
  })
})
