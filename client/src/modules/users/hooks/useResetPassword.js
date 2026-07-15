import { useMutation } from "@tanstack/react-query";

import { resetPassword } from "../services/userServices";

const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPassword,
  });
};

export default useResetPassword;
