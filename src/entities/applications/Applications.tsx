import { useState } from "react";
import type { Filters } from "./model/types";
import { useApplication } from "./api/useApplications";

const Applications = () => {
  const [filters, setFilters] = useState<Filters>({
    search: "",
    status: "",
    page: 1,
  });

  const { data, isPending, isError, error } = useApplication(filters);

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
      )}
    </div>
  );
};

export default Applications;
