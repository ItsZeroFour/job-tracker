import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchStatus } from "../../../entities/applications/api/ApplicationsApi";
import type {
  ApplicationsPage,
  Status,
} from "../../../entities/applications/model/types";

interface MutationProps {
  id: string;
  status: Status;
}

export const useChangeStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: MutationProps) => patchStatus(id, status),

    onMutate: async ({ id, status }: MutationProps) => {
      await queryClient.cancelQueries({ queryKey: ["applications"] });

      queryClient.setQueriesData<ApplicationsPage>(
        { queryKey: ["applications"] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            items: old.items.map((item) => {
              if (item.id === id) {
                return { ...item, status };
              } else {
                return item;
              }
            }),
          };
        },
      );
    },

    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
};
