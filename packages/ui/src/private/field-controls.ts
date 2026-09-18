// Keep registration outside component modules so Fast Refresh retains prior identities.
const controls = new WeakSet<object>()
export function registerFieldControl(control: object) {
  controls.add(control)
}
export function isFieldControl(control: unknown): boolean {
  return typeof control === "function" && controls.has(control)
}
