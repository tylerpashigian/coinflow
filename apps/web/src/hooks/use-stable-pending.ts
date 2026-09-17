import { useLayoutEffect, useRef, useState } from "react"

type StablePendingOptions = {
  pendingMinMs?: number
  pendingMs?: number
}

/**
 * Delays loading feedback for short requests and, once visible, keeps it on
 * screen long enough to avoid a distracting flash.
 */
export function useStablePending(
  isPending: boolean,
  { pendingMs = 200, pendingMinMs = 400 }: StablePendingOptions = {}
) {
  const [isVisible, setIsVisible] = useState(false)
  const shownAtRef = useRef<number | null>(null)

  useLayoutEffect(() => {
    if (isPending) {
      if (isVisible) return

      if (pendingMs === 0) {
        shownAtRef.current = Date.now()
        // This pre-paint update is intentional: zero means show immediately.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsVisible(true)
        return
      }

      const showTimer = window.setTimeout(() => {
        shownAtRef.current = Date.now()
        setIsVisible(true)
      }, pendingMs)

      return () => window.clearTimeout(showTimer)
    }

    if (!isVisible) return

    const visibleFor = Date.now() - (shownAtRef.current ?? Date.now())
    const remainingMs = Math.max(0, pendingMinMs - visibleFor)
    const hideTimer = window.setTimeout(() => {
      shownAtRef.current = null
      setIsVisible(false)
    }, remainingMs)

    return () => window.clearTimeout(hideTimer)
  }, [isPending, isVisible, pendingMinMs, pendingMs])

  return isVisible
}
