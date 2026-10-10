import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { Filters } from "../model/types";
import { fetchApplications } from "./ApplicationsApi";

// Чтение данных с сервера и кладем их в кэш
export const useApplications = (filters: Filters) =>
  useQuery({
    /*
      queryKey должен зависить от фильтров при
      изменении страницы
      (из тестов [[useApplications.test.tsx]])

      Новый ключ означает новая запись в кэше
    */
    queryKey: ["applications", filters],
    queryFn: () => fetchApplications(filters),
    placeholderData: keepPreviousData,
  });
