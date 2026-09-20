import { AlertDialog as Primitive } from "@base-ui/react/alert-dialog"
import { Button } from "./button"
import { buttonVariants } from "./button-variants"
import { Input } from "./input"

export interface AlertDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel: string
  onConfirm: () => void
  pending?: boolean
  tone?: "default" | "destructive"
  input?: {
    label: string
    value: string
    onValueChange: (value: string) => void
    placeholder?: string
    required?: boolean
  }
}

/** Opinionated shadcn Alert Dialog for consequential confirmation. */
export function AlertDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  onConfirm,
  pending = false,
  tone = "default",
  input,
}: AlertDialogProps) {
  return (
    <Primitive.Root
      open={open}
      onOpenChange={(next) => {
        if (!pending) onOpenChange(next)
      }}
    >
      <Primitive.Portal>
        <Primitive.Backdrop className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-[1px]" />
        <Primitive.Viewport className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <Primitive.Popup className="w-full max-w-md rounded-xl border border-border bg-popover p-5 text-popover-foreground shadow-lg outline-none">
            <Primitive.Title className="text-base font-semibold">
              {title}
            </Primitive.Title>
            <Primitive.Description className="mt-2 text-sm text-muted-foreground">
              {description}
            </Primitive.Description>
            {input && (
              <div className="mt-4">
                <Input
                  aria-label={input.label}
                  placeholder={input.placeholder}
                  value={input.value}
                  onValueChange={input.onValueChange}
                  required={input.required}
                />
              </div>
            )}
            <div className="mt-5 flex justify-end gap-2">
              <Primitive.Close
                disabled={pending}
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                Cancel
              </Primitive.Close>
              <Button
                label={pending ? "Working…" : confirmLabel}
                variant={tone === "destructive" ? "destructive" : "default"}
                size="sm"
                disabled={pending || (input?.required && !input.value.trim())}
                onPress={onConfirm}
              />
            </div>
          </Primitive.Popup>
        </Primitive.Viewport>
      </Primitive.Portal>
    </Primitive.Root>
  )
}
