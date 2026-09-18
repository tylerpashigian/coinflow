import type { IconName } from "./icons"
export interface OverlayTrigger {
  label: string
  icon?: IconName
  iconOnly?: boolean
  disabled?: boolean
}
export interface OverlayAction {
  label: string
  onPress: () => void
  tone?: "default" | "destructive"
  disabled?: boolean
  close?: boolean
}
