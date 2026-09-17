import { Text } from "@workspace/ui/components/text"

type PageFeedbackProps = {
  message: string
  status: "error" | "loading"
}

/** A centered, presentational feedback state for application pages. */
export function PageFeedback({ message, status }: PageFeedbackProps) {
  const isLoading = status === "loading"

  return (
    <section className="grid min-h-svh place-items-center p-5 md:p-9">
      <div
        aria-live="polite"
        className="flex max-w-sm flex-col items-center gap-3 text-center"
        role={isLoading ? "status" : "alert"}
      >
        {isLoading ? (
          <span
            aria-hidden="true"
            className="size-5 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-primary"
          />
        ) : null}
        <Text tone={isLoading ? "muted" : "danger"}>{message}</Text>
      </div>
    </section>
  )
}
