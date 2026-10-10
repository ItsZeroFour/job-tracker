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

  it("показывает ошибку если сервер упал", async () => {
    vi.mocked(fetchApplications).mockRejectedValue(new Error("Ошибка сервера"));
    renderWithProviders(<Applications />);
    expect(await screen.findByText("Ошибка сервера")).toBeInTheDocument();
  });

  it("показывает сообщение, если откликов нет", async () => {
    vi.mocked(fetchApplications).mockResolvedValue({ items: [], total: 0 });
    renderWithProviders(<Applications />);
    expect(await screen.findByText("Откликов пока нет")).toBeInTheDocument();
  });

  it("показывает ссылку только у откликов где она есть", async () => {
    vi.mocked(fetchApplications).mockResolvedValue({
      items: [
        makeApplication({ link: "https://example.com/job", company: "Кварк" }),
        makeApplication({ company: "Сигма" }),
      ],
      total: 2,
    });

    renderWithProviders(<Applications />);

    expect(await screen.findByText("Кварк")).toBeInTheDocument();
    expect(screen.getByText("Сигма")).toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: "Открыть вакансию" }),
    ).toHaveAttribute("href", "https://example.com/job");

    expect(screen.getAllByText("Открыть вакансию")).toHaveLength(1);
  });
});
