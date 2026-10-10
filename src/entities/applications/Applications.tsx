import { useState } from "react";
import { page_size, type Filters } from "./model/types";
import { useApplications } from "./api/useApplications";

const Applications = () => {
  const [filters, setFilters] = useState<Filters>({
    search: "",
    status: "",
    page: 1,
  });

  const { data, isPending, isError, error } = useApplications(filters);

  if (isPending) {
    return <div>Загрузка</div>;
  }

  if (isError) {
    return <div>{error.message}</div>;
  }

  return (
    <div>
      {data.items.length === 0 ? (
        <div>Откликов пока нет</div>
      ) : (
        <div>
          <ul>
            {data.items.map((item) => (
              <li key={item.id}>
                <h3>{item.position}</h3>
                <p>{item.company}</p>

                {item.link && (
                  <a href={item.link} target="_blank" rel="noreferrer">
                    Открыть вакансию
                  </a>
                )}
              </li>
            ))}
          </ul>

          <button
            onClick={() =>
              setFilters((prev) => ({ ...prev, page: prev.page - 1 }))
            }
            disabled={filters.page === 1}
          >
            Назад
          </button>
          <button
            onClick={() =>
              setFilters((prev) => ({ ...prev, page: prev.page + 1 }))
            }
            disabled={filters.page >= Math.ceil(data.total / page_size)}
          >
            Вперед
          </button>
        </div>
      )}
    </div>
  );
};

export default Applications;
