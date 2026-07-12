import { useQuery } from "@tanstack/react-query";

import { getUsers } from "../services/userServices";

const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });
};

export default useUsers;
