import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createUser } from "../services/userServices";

const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
};

export default useCreateUser;
