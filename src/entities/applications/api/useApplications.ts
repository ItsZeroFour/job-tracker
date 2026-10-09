import { useQuery } from "@tanstack/react-query";
import type { Filters } from "../model/types";
import { fetchApplications } from "./ApplicationsApi";

export const useApplication = (filters: Filters) =>
  useQuery({
    queryKey: ["application"],
    queryFn: () => fetchApplications(filters),
  });
