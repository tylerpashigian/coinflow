import { registerFieldControl } from "../private/field-controls"
import { useEffect, useImperativeHandle, useRef, useState } from "react"
import { Input as Primitive } from "@base-ui/react/input"
import { useFormFieldContext } from "./field-context"
import { inputVariants } from "./input-variants"
import { Icon } from "../private/icons"
import { Kbd } from "./kbd"
import { Button } from "./button"
export interface FocusHandle {
  focus(): void
}
export interface InputProps {
  id?: string
  name?: string
  value?: string
  defaultValue?: string
  placeholder?: string
  type?: "text" | "search" | "email" | "password" | "tel" | "url"
  disabled?: boolean
  required?: boolean
  readOnly?: boolean
  onValueChange?: (value: string) => void
  focusHandle?: { current: FocusHandle | null }
  "aria-describedby"?: string
  "aria-invalid"?: boolean | "true" | "false" | "grammar" | "spelling"
  "aria-label"?: string
  "aria-labelledby"?: string
  "data-testid"?: string
  size?: "sm" | "md" | "lg"
  leadingIcon?: "search"
  shortcut?: string
}
export function Input({
  id,
  name,
  value,
  defaultValue,
  placeholder,
  type = "text",
  disabled,
  required,
  readOnly,
  onValueChange,
  focusHandle,
  "aria-describedby": describedBy,
  "aria-invalid": invalid,
  "aria-label": label,
  "aria-labelledby": labelledBy,
  "data-testid": testId,
  size = "md",
  leadingIcon,
  shortcut,
}: InputProps) {
  const field = useFormFieldContext()
  const ref = useRef<HTMLInputElement>(null)
  const [hasSearchValue, setHasSearchValue] = useState(
    Boolean(value ?? defaultValue)
  )
  const showClearButton =
    type === "search" && hasSearchValue && !disabled && !readOnly

  useEffect(() => {
    if (value !== undefined) setHasSearchValue(Boolean(value))
  }, [value])

  useImperativeHandle(
    focusHandle,
    () => ({ focus: () => ref.current?.focus() }),
    []
  )
  return (
    <div className="relative flex w-full items-center">
      <Primitive
        ref={ref}
        id={id ?? field?.controlId}
        name={name}
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        type={type}
        disabled={disabled}
        required={required}
        readOnly={readOnly}
        onChange={(event) => {
          setHasSearchValue(Boolean(event.target.value))
          onValueChange?.(event.target.value)
        }}
        aria-describedby={describedBy ?? field?.describedBy}
        aria-invalid={invalid ?? (field?.invalid || undefined)}
        aria-label={label}
        aria-labelledby={label || labelledBy ? labelledBy : field?.labelledBy}
        data-testid={testId}
        className={inputVariants({
          size,
          hasLeadingContent: !!leadingIcon,
          hasTrailingContent: !!shortcut || showClearButton,
        })}
      />
      {leadingIcon && (
        <span className="pointer-events-none absolute left-2 text-muted-foreground">
          <Icon name={leadingIcon} />
        </span>
      )}
      {showClearButton ? (
        <span className="absolute right-1">
          <Button
            label="Clear search"
            icon="close"
            iconOnly
            variant="ghost"
            size="sm"
            onPress={() => {
              if (ref.current) ref.current.value = ""
              setHasSearchValue(false)
              onValueChange?.("")
              ref.current?.focus()
            }}
          />
        </span>
      ) : shortcut ? (
        <span className="pointer-events-none absolute right-2">
          <Kbd>{shortcut}</Kbd>
        </span>
      ) : null}
    </div>
  )
}

registerFieldControl(Input)
