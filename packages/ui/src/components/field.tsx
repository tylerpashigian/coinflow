import * as React from "react"
import { cn } from "cn"
import { FormFieldContext } from "./field-context"
import { isFieldControl } from "../private/field-controls"
export interface FormFieldProps {
  children: React.ReactElement
  /** Helper text announced to assistive technology when no error is present. */
  description?: string
  /** A controlled validation message. It replaces the helper text when present. */
  error?: string
  /** The accessible name for the associated control. */
  label: string
  /** Keeps the label available to assistive technology without affecting compact layouts. */
  labelVisuallyHidden?: boolean
  /** Layout treatment selected by the design system. */
  orientation?: "vertical" | "horizontal" | "responsive"
  /** Test-only selector. */
  "data-testid"?: string
}

/**
 * Composes a label, one control, and optional helper or error text.
 *
 * Controls that support this composition consume the private field context to
 * receive their accessible name, feedback association, and invalid state.
 */

function FormField({
  children,
  description,
  error,
  label,
  labelVisuallyHidden = false,
  orientation = "vertical",
  "data-testid": testId,
}: FormFieldProps) {
  const generatedControlId = React.useId()
  const child = React.Children.only(children)
  if (!isFieldControl(child.type))
    throw new Error(
      "FormField requires one Input, Select, or DateRangePicker child."
    )
  const controlId = (child.props as { id?: string }).id ?? generatedControlId
  const labelId = React.useId()
  const descriptionId = React.useId()
  const errorId = React.useId()
  const feedbackId = error ? errorId : description ? descriptionId : undefined
  const invalid = Boolean(error)

  return (
    <div
      className={cn(
        "flex gap-2",
        orientation === "horizontal"
          ? "flex-row items-center"
          : orientation === "responsive"
            ? "flex-col md:flex-row md:items-center"
            : "flex-col"
      )}
      role="group"
      aria-describedby={feedbackId}
      aria-labelledby={labelId}
      data-invalid={invalid || undefined}
      data-testid={testId}
    >
      {labelVisuallyHidden ? (
        <span className="sr-only" id={labelId}>
          {label}
        </span>
      ) : (
        <label
          className="leading-snug font-medium"
          htmlFor={controlId}
          id={labelId}
        >
          {label}
        </label>
      )}
      <FormFieldContext.Provider
        value={{
          controlId,
          describedBy: feedbackId,
          invalid,
          labelledBy: labelId,
        }}
      >
        {children}
      </FormFieldContext.Provider>
      {error ? (
        <div role="alert" className="text-xs text-destructive" id={errorId}>
          {error}
        </div>
      ) : description ? (
        <p className="text-xs text-muted-foreground" id={descriptionId}>
          {description}
        </p>
      ) : null}
    </div>
  )
}

export { FormField }
