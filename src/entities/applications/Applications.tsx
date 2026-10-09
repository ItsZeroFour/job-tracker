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
      <ul>
        {data.items.map((item) => (
          <li>
            <h3>{item.position}</h3>
            <p>{item.company}</p>

            <a href={item.link} target="_blank">
              Открыть вакансию
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Applications;
