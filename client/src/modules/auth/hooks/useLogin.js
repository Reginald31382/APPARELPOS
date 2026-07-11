import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { login as loginRequest } from "../services/authService";
import useAuthStore from "../store/useAuthStore";

const useLogin = () => {
  const navigate = useNavigate();

  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: loginRequest,

    onSuccess: (data) => {
      login(data);

      navigate("/admin");
    },
  });
};

export default useLogin;
