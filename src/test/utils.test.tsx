import { makeApplication } from "./utils";

// vite.config.ts стоит globals: true - не импортируем describe, it, expect

describe("Make Application", () => {
  it("по умолчанию создаёт отклик со статусом applied", () => {
    const app = makeApplication();
    expect(app.status).toBe("applied");
  });

  it("позволяет переопределить поле", () => {
    const create = makeApplication({ company: "Кварк" });
    expect(create.company).toBe("Кварк");
    expect(create.position).toBe("React Developer");
  });

  it("при каждом вызове выдаёт новый id", () => {
    const createFirst = makeApplication();
    const createSecond = makeApplication();

    expect(createFirst.id).not.toBe(createSecond.id);
  });
});
