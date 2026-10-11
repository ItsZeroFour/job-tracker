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

      const previous = queryClient.getQueriesData<ApplicationsPage>({
        queryKey: ["applications"],
      });

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

      return { previous };
    },

    onError: (_error, _variables, context) => {
      context?.previous.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },

    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["applications"] }),
  });
};
