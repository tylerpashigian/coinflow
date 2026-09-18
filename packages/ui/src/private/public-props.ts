/** Removes props that would let a consumer restyle or replace a UI primitive. */
export type PublicProps<Props> = Props extends unknown
  ? Omit<Props, "className" | "style" | "render" | "asChild">
  : never
