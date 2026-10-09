import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactElement, ReactNode } from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Application } from "../entities/applications/model/types";

export const createTestClient = () =>
  new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

export const createWrapper =
  (client = createTestClient()) =>
  ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );

export function renderWithProviders(
  ui: ReactElement,
  client = createTestClient(),
) {
  return {
    client,
    user: userEvent.setup(),
    ...render(ui, { wrapper: createWrapper(client) }),
  };
}

export const makeApplication = (o: Partial<Application> = {}): Application => ({
  id: crypto.randomUUID(),
  company: "Нордлайн",
  position: "React Developer",
  status: "applied",
  createdAt: "2026-10-01T10:00:00.000Z",
  ...o,
});
