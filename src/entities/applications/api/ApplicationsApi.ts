import seed from "../../../app/mocks/applications.seed.json";
import type {
  Application,
  ApplicationsPage,
  Filters,
  Status,
} from "../model/types";

const LIMIT = 10;

let db = seed as Application[];

const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

export async function fetchApplication(id: string): Promise<Application> {
  await delay(300);

  const found = db.find((item) => item.id === id);

  if (!found) {
    throw new Error("Отклик не найден");
  }

  return found;
}

export async function fetchApplications(f: Filters): Promise<ApplicationsPage> {
  await delay(400);

  const search = f.search.toLowerCase();

  const filtered = db.filter(
    (item) =>
      item.company.toLowerCase().includes(search) &&
      (!f.status || item.status === f.status),
  );

  return {
    items: filtered.slice((f.page - 1) * LIMIT, f.page * LIMIT),
    total: filtered.length,
  };
}

export async function patchStatus(
  id: string,
  status: Status,
): Promise<Application> {
  await delay(500);

  if (Math.random() < 0.1) throw new Error("Ошибка сервера");

  db = db.map((item) => (item.id === id ? { ...item, status } : item));
  return db.find((item) => item.id === id)!;
}
