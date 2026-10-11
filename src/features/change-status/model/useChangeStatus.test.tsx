import { act, renderHook, waitFor } from "@testing-library/react";
import {
  fetchApplications,
  patchStatus,
} from "../../../entities/applications/api/ApplicationsApi";
import { createWrapper, makeApplication } from "../../../test/utils";
import { useApplications } from "../../../entities/applications/api/useApplications";
import { useChangeStatus } from "./useChangeStatus";
import type { Application } from "../../../entities/applications/model/types";

vi.mock("../../../entities/applications/api/ApplicationsApi");

beforeEach(() => {
  vi.clearAllMocks();
});

describe("usewChangeStatus", () => {
  it("после смены статуса список запрашивается заново", async () => {
    vi.mocked(fetchApplications).mockResolvedValue({ items: [], total: 0 });
    vi.mocked(patchStatus).mockResolvedValue(makeApplication());

    const { result } = renderHook(
      () => ({
        list: useApplications({ search: "", status: "", page: 1 }),
        change: useChangeStatus(),
      }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(fetchApplications).toHaveBeenCalledTimes(1));

    await act(async () => {
      result.current.change.mutate({ id: "1", status: "interview" });
    });

    expect(patchStatus).toHaveBeenCalledWith("1", "interview");

    await waitFor(() => expect(fetchApplications).toHaveBeenCalledTimes(2));
  });

  it("статус меняется в списке сразу, не дожидаясь сервера", async () => {
    const app = makeApplication({ id: "1", status: "applied" });

    vi.mocked(fetchApplications).mockResolvedValue({ items: [app], total: 1 });
    vi.mocked(patchStatus).mockImplementation(
      () => new Promise<Application>(() => {}),
    );

    const { result } = renderHook(
      () => ({
        list: useApplications({ search: "", status: "", page: 1 }),
        change: useChangeStatus(),
      }),
      { wrapper: createWrapper() },
    );

    await waitFor(() =>
      expect(result.current.list.data?.items[0].status).toEqual("applied"),
    );

    await act(async () => {
      result.current.change.mutate({ id: "1", status: "interview" });
    });

    await waitFor(() =>
      expect(result.current.list.data?.items[0].status).toEqual("interview"),
    );
  });

  it("откатывает статус, если pathStatus упал", async () => {
    vi.mocked(fetchApplications).mockResolvedValue({
      items: [makeApplication({ id: "1", status: "applied" })],
      total: 1,
    });

    vi.mocked(patchStatus).mockRejectedValue(new Error("Ошибка сервера"));

    const { result } = renderHook(
      () => ({
        list: useApplications({ page: 1, status: "applied", search: "" }),
        change: useChangeStatus(),
      }),
      { wrapper: createWrapper() },
    );

    await waitFor(() =>
      expect(result.current.list.data?.items[0].status).toBe("applied"),
    );

    await act(async () => {
      result.current.change.mutate({ id: "1", status: "interview" });
    });

    await waitFor(() => expect(result.current.change.isError).toBe(true));

    await waitFor(() =>
      expect(result.current.list.data?.items[0].status).toBe("applied"),
    );
  });
});
