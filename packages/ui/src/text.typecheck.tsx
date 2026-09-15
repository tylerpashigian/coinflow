import { createRef } from "react"
import { Text } from "./components/text"

// Compiled by `pnpm typecheck`; never shipped to the app.
export function textTypeChecks() {
  return [
    <Text key="body">Body</Text>,
    <Text key="heading" as="h1" variant="heading" size="lg" weight="bold">
      Heading
    </Text>,
    <Text
      key="label"
      as="label"
      htmlFor="name"
      ref={createRef<HTMLLabelElement>()}
    >
      Name
    </Text>,
    // @ts-expect-error Arbitrary strings are not supported elements.
    <Text key="unknown" as="whatever">
      Invalid
    </Text>,
    // @ts-expect-error Interactive elements belong to their own components.
    <Text key="button" as="button">
      Invalid
    </Text>,
    // @ts-expect-error Paragraphs do not accept label attributes.
    <Text key="attribute" as="p" htmlFor="name">
      Invalid
    </Text>,
    // @ts-expect-error Without `as`, Text is a paragraph, not a label.
    <Text key="default" htmlFor="name">
      Invalid
    </Text>,
    // @ts-expect-error Explicit non-paragraph generics still require as.
    <Text<"label"> key="generic" htmlFor="name">
      Invalid
    </Text>,
    // @ts-expect-error Typography tokens are a closed set.
    <Text key="size" size="huge">
      Invalid
    </Text>,
  ]
}
