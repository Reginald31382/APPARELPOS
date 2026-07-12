import { useState } from "react";
import useSetup from "../../modules/auth/hooks/useSetup";
import { Navigate } from "react-router-dom";

import useLogin from "../../modules/auth/hooks/useLogin";

const Login = () => {
  const { data, isLoading } = useSetup();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (data && !data.hasUsers) {
    return <Navigate to="/setup" replace />;
  }
  const { mutate, isPending, error } = useLogin();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    mutate({
      email,
      password,
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg"
      >
        <h1 className="mb-6 text-center text-3xl font-bold">
          J.Rome POS Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="mb-4 w-full rounded-lg border p-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="mb-6 w-full rounded-lg border p-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p className="mb-4 text-sm text-red-600">
            Invalid email or password.
          </p>
        )}

        <button
          disabled={isPending}
          className="w-full rounded-lg bg-black py-3 text-white transition hover:bg-gray-800 disabled:opacity-50"
        >
          {isPending ? "Signing In..." : "Sign In"}
        </button>
      </form>
    </div>
  );
};

export default Login;
