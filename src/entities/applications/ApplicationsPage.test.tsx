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

  it("Переключает страницы по кнопке Вперед", async () => {
    // vi.mocked(fetchApplications).mockResolvedValue({
    //   items: [
    //     makeApplication({ company: "Popa" }),
    //     makeApplication({ company: "Pisun" }),
    //   ],
    //   total: 11,
    // });

    vi.mocked(fetchApplications).mockImplementation(async ({ page }) => ({
      items:
        page === 1
          ? [makeApplication({ company: "Popa" })]
          : [makeApplication({ company: "Pisun" })],
      total: 11,
    }));

    const { user } = renderWithProviders(<Applications />);

    // 1 стр
    expect(await screen.findByText("Popa")).toBeInTheDocument();
    expect(screen.queryByText("Pisun")).not.toBeInTheDocument();

    // Клик
    await user.click(screen.getByRole("button", { name: "Вперед" }));

    // 2 стр
    expect(await screen.findByText("Pisun")).toBeInTheDocument();
    expect(screen.queryByText("Popa")).not.toBeInTheDocument();
  });

  it("Проверка на disabled у кнопок пагинации", async () => {
    vi.mocked(fetchApplications).mockImplementation(async ({ page }) => ({
      items:
        page === 1
          ? [makeApplication({ company: "Popa" })]
          : [makeApplication({ company: "Pisun" })],
      total: 11,
    }));

    const { user } = renderWithProviders(<Applications />);

    expect(await screen.findByText("Popa")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Назад" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Вперед" })).toBeEnabled();

    await user.click(screen.getByRole("button", { name: "Вперед" }));
    expect(await screen.findByText("Pisun")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Назад" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Вперед" })).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Назад" }));
    expect(await screen.findByText("Popa")).toBeInTheDocument();
    expect(screen.queryByText("Pisun")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Назад" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Вперед" })).toBeEnabled();
  });
});
