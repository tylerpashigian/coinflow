import { setupWorker } from "msw/browser"
import { handlers } from "@/data/mocks/handlers"

export const worker = setupWorker(...handlers)
