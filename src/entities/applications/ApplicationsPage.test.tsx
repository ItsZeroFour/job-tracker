import { makeApplication, renderWithProviders } from "../../test/utils";
import { fetchApplications } from "./api/ApplicationsApi";
import Applications from "./Applications";
import { screen } from "@testing-library/react";

vi.mock("./api/ApplicationsApi");

beforeEach(() => {
  vi.clearAllMocks();
});


describe("ApplicationsPage", () => {
  it("сначала загрузка - потом список", async () => {
    vi.mocked(fetchApplications).mockResolvedValue({
      items: [
        makeApplication({ company: "Кварк" }),
        makeApplication({ company: "Нордлайн" }),
      ],

      total: 2,
    });

    renderWithProviders(<Applications />);

    expect(screen.getByText("Загрузка")).toBeInTheDocument();

    expect(await screen.findByText("Кварк")).toBeInTheDocument();
    expect(screen.getByText("Нордлайн")).toBeInTheDocument();

    expect(screen.queryByText("Загрузка")).not.toBeInTheDocument();
  });
});