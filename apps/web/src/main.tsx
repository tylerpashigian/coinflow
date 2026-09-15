import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "@workspace/ui/globals.css"
import { App } from "./App.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"

async function bootstrap() {
  if (import.meta.env.DEV || import.meta.env.VITE_ENABLE_MOCKS === "true") {
    const { worker } = await import("./mocks/browser")
    await worker.start({ onUnhandledRequest: "bypass" })
  }

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </StrictMode>
  )
}

void bootstrap()
