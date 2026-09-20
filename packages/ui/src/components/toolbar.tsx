import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { Button } from "./button"
import type { IconName } from "../private/icons"

export interface ToolbarItem {
  id: string
  /** Accessible name for the icon action. */
  label: string
  icon: IconName
  onPress: () => void
  disabled?: boolean
  tone?: "default" | "destructive"
}

export interface ToolbarProps {
  /** Accessible name that identifies the toolbar's action context. */
  ariaLabel: string
  /** Controls the toolbar's animated presence. */
  open: boolean
  /** Optional concise context, such as the number of selected records. */
  summary?: string
  items: readonly ToolbarItem[]
  "data-testid"?: string
}

export function Toolbar({
  ariaLabel,
  open,
  summary,
  items,
  "data-testid": testId,
}: ToolbarProps) {
  const reduceMotion = useReducedMotion()

  return (
    <AnimatePresence initial={false}>
      {open ? (
        <div className="pointer-events-none fixed inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 flex justify-center px-4">
          <motion.aside
            aria-label={ariaLabel}
            data-testid={testId}
            role="toolbar"
            initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { bounce: 0.16, duration: 0.32, type: "spring" }
            }
            layout
            className="pointer-events-auto flex max-w-full items-center overflow-x-auto rounded-xl border border-border bg-popover p-2 text-popover-foreground shadow-lg"
          >
            {summary ? (
              <motion.span
                layout="position"
                className="max-w-48 truncate px-2 text-xs/relaxed font-medium whitespace-nowrap"
              >
                {summary}
              </motion.span>
            ) : null}
            <motion.div
              layout="position"
              className="flex shrink-0 items-center gap-0.5"
            >
              {items.map((item) => (
                <Button
                  key={item.id}
                  disabled={item.disabled}
                  icon={item.icon}
                  iconOnly
                  label={item.label}
                  onPress={item.onPress}
                  size="sm"
                  variant={
                    item.tone === "destructive" ? "destructive" : "ghost"
                  }
                />
              ))}
            </motion.div>
          </motion.aside>
        </div>
      ) : null}
    </AnimatePresence>
  )
}
