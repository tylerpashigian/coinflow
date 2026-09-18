export interface KbdProps {
  children: string
  "data-testid"?: string
}
export function Kbd({ children, "data-testid": testId }: KbdProps) {
  return (
    <kbd
      data-testid={testId}
      className="pointer-events-none inline-flex h-5 min-w-5 items-center justify-center rounded-xs bg-muted px-1 font-sans text-[0.625rem] font-medium text-muted-foreground"
    >
      {children}
    </kbd>
  )
}
