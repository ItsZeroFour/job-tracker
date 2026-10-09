import { fetchApplications } from "./ApplicationsApi";
import seed from "../../../app/mocks/applications.seed.json";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("fetchApplications", () => {
  it("Отдает первую страницу из 10 записей", async () => {
    const promise = fetchApplications({ search: "", status: "", page: 1 });
    await vi.advanceTimersByTimeAsync(500);
    const { items, total } = await promise;

    expect(items).toEqual(seed.slice(0, 10));
    expect(items).toHaveLength(10);
    expect(total).toBe(45);
  });

  it("Тест по статусам на 2 странице: 11 записей interview, на второй странице остаётся 1", async () => {
    const promise = fetchApplications({
      search: "",
      status: "interview",
      page: 2,
    });

    await vi.advanceTimersByTimeAsync(500);

    const { items } = await promise;

    expect(items.every((item) => item.status === "interview")).toBe(true);

    expect(items).toHaveLength(1);
  });
});
