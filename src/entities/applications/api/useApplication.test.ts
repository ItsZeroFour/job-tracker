import { renderHook, waitFor } from "@testing-library/react";
import { createWrapper, makeApplication } from "../../../test/utils";
import { fetchApplication } from "./ApplicationsApi";
import { useApplication } from "./useApplication";

vi.mock("./ApplicationsApi");

describe("useApplication", () => {
  it("загружает вакансию во id", async () => {
    vi.mocked(fetchApplication).mockResolvedValue(
      makeApplication({ id: "5", company: "Popa" }),
    );

    const { result } = renderHook(() => useApplication("5"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.data?.company).toBe("Popa"));

    expect(fetchApplication).toHaveBeenCalledWith("5");
  });

  it("Возвращает разные id", async () => {
    vi.mocked(fetchApplication).mockImplementation((id) =>
      Promise.resolve(makeApplication({ id: id, company: `Компания ${id}` })),
    );

    const { result, rerender } = renderHook(({ id }) => useApplication(id), {
      wrapper: createWrapper(),
      initialProps: { id: "5" },
    });

    await waitFor(() =>
      expect(result.current.data?.company).toBe("Компания 5"),
    );

    rerender({ id: "6" });

    await waitFor(() =>
      expect(result.current.data?.company).toBe("Компания 6"),
    );
  });
});
