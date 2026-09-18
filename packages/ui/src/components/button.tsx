import { Button as Primitive } from "@base-ui/react/button"
import { buttonVariants } from "./button-variants"
import { Icon, type IconName } from "../private/icons"
export interface ButtonProps {
  label: string
  icon?: IconName
  iconOnly?: boolean
  variant?:
    "default" | "outline" | "secondary" | "ghost" | "destructive" | "link"
  size?: "sm" | "md" | "lg"
  type?: "button" | "submit" | "reset"
  onPress?: () => void
  disabled?: boolean
  id?: string
  name?: string
  "aria-describedby"?: string
  "data-testid"?: string
}
export function Button({
  label,
  icon,
  iconOnly = false,
  variant = "default",
  size = "md",
  type = "button",
  onPress,
  disabled,
  id,
  name,
  "aria-describedby": describedBy,
  "data-testid": testId,
}: ButtonProps) {
  return (
    <Primitive
      id={id}
      name={name}
      type={type}
      disabled={disabled}
      onClick={onPress}
      aria-label={iconOnly ? label : undefined}
      aria-describedby={describedBy}
      data-testid={testId}
      data-slot="button"
      className={buttonVariants({
        variant,
        size: iconOnly
          ? size === "md"
            ? "icon"
            : `icon-${size}`
          : size === "md"
            ? "default"
            : size,
      })}
    >
      {icon && <Icon name={icon} />} {!iconOnly && label}
    </Primitive>
  )
}
