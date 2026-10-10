import { renderHook, waitFor } from "@testing-library/react";
import { fetchApplications } from "./ApplicationsApi";
import { useApplications } from "./useApplications";
import { createWrapper } from "../../../test/utils";

vi.mock("./ApplicationsApi");

beforeEach(() => {
  vi.clearAllMocks();
});

it("запрашивает данные заново при смене страницы", async () => {
  vi.mocked(fetchApplications).mockResolvedValue({ items: [], total: 0 });

  const { rerender } = renderHook(
    ({ page }) => useApplications({ search: "", status: "", page }),
    { wrapper: createWrapper(), initialProps: { page: 1 } },
  );

  await waitFor(() =>
    expect(fetchApplications).toHaveBeenCalledWith(
      expect.objectContaining({ page: 1 }),
    ),
  );

  rerender({ page: 2 });

  await waitFor(() =>
    expect(fetchApplications).toHaveBeenCalledWith(
      expect.objectContaining({ page: 2 }),
    ),
  );
});
