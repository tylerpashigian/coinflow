import { registerFieldControl } from "../private/field-controls"
import * as P from "../private/select"
export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
  group?: string
}
export interface SelectProps {
  options: readonly SelectOption[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  required?: boolean
  name?: string
  id?: string
  size?: "sm" | "md" | "lg"
  "aria-label"?: string
  "aria-labelledby"?: string
  "aria-describedby"?: string
  "aria-invalid"?: boolean | "true" | "false" | "grammar" | "spelling"
  "data-testid"?: string
}
export function Select({
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder,
  disabled,
  required,
  name,
  id,
  size = "md",
  "aria-label": label,
  "aria-labelledby": labelledBy,
  "aria-describedby": describedBy,
  "aria-invalid": invalid,
  "data-testid": testId,
}: SelectProps) {
  const groups = [...new Set(options.map((option) => option.group))]
  return (
    <P.Select
      items={Object.fromEntries(
        options.map((option) => [option.value, option.label])
      )}
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      disabled={disabled}
      name={name}
      required={required}
    >
      <P.SelectTrigger
        id={id}
        size={size}
        width="full"
        aria-label={label}
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        aria-invalid={invalid}
        data-testid={testId}
      >
        <P.SelectValue placeholder={placeholder} />
      </P.SelectTrigger>
      <P.SelectContent>
        {groups.map((group) => (
          <P.SelectGroup key={group ?? "ungrouped"}>
            {group && <P.SelectLabel>{group}</P.SelectLabel>}
            {options
              .filter((option) => option.group === group)
              .map((option) => (
                <P.SelectItem
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </P.SelectItem>
              ))}
          </P.SelectGroup>
        ))}
      </P.SelectContent>
    </P.Select>
  )
}

registerFieldControl(Select)
