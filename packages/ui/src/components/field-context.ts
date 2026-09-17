import * as React from "react"

type FormFieldContextValue = {
  controlId: string
  describedBy?: string
  invalid: boolean
  labelledBy: string
}

const FormFieldContext = React.createContext<FormFieldContextValue | null>(null)

function useFormFieldContext() {
  return React.useContext(FormFieldContext)
}

export { FormFieldContext, useFormFieldContext }
