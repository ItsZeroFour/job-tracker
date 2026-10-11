import { useQuery } from "@tanstack/react-query";
import { fetchApplication } from "./ApplicationsApi";

export const useApplication = (id: string) =>
  useQuery({
    queryKey: ["application", id],
    queryFn: () => fetchApplication(id),
  });
