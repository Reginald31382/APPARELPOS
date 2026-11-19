import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [resetToken, setResetToken] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // STEP 1: Retrieve recovery questions
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/recovery/questions", {
        email,
      });

      setQuestions(response.data.questions);
      setStep(2);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to continue recovery. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify security answers
  const handleVerifyAnswers = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const submittedAnswers = questions.map((question) => ({
      questionId: question.id,
      answer: answers[question.id] || "",
    }));

    try {
      const response = await api.post("/auth/recovery/verify", {
        email,
        answers: submittedAnswers,
      });

      setResetToken(response.data.resetToken);
      setStep(3);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to verify your answers. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // STEP 3: Reset password
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/recovery/reset-password", {
        resetToken,
        newPassword,
      });

      setSuccess("Password reset successfully.");
      setResetToken("");
      setStep(4);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to reset password. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 p-3 outline-none transition focus:border-black";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="relative w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <Link
          to="/login"
          className="absolute left-4 top-4 text-sm text-gray-500 hover:text-black"
        >
          ← Back to Login
        </Link>

        <h1 className="mb-2 mt-8 text-center text-2xl font-bold">
          Password Recovery
        </h1>

        <p className="mb-6 text-center text-sm text-gray-500">
          Step {Math.min(step, 3)} of 3
        </p>

        {/* STEP 1 */}
        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <p className="text-sm text-gray-600">
              Enter your account email to begin recovering your password.
            </p>

            <input
              type="email"
              placeholder="Email address"
              required
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-black py-3 text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Continue"}
            </button>
          </form>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <form onSubmit={handleVerifyAnswers} className="space-y-4">
            <p className="text-sm text-gray-600">
              Answer both security questions to verify your account.
            </p>

            {questions.map((question) => (
              <div key={question.id}>
                <label className="mb-2 block text-sm font-medium">
                  {question.question}
                </label>

                <input
                  type="text"
                  required
                  autoComplete="off"
                  className={inputClass}
                  value={answers[question.id] || ""}
                  onChange={(e) =>
                    setAnswers((prev) => ({
                      ...prev,
                      [question.id]: e.target.value,
                    }))
                  }
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-black py-3 text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify Answers"}
            </button>
          </form>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <p className="text-sm text-gray-600">Create your new password.</p>

            <input
              type="password"
              placeholder="New password"
              minLength={8}
              maxLength={128}
              required
              autoComplete="new-password"
              className={inputClass}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="Confirm new password"
              required
              autoComplete="new-password"
              className={inputClass}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-black py-3 text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <div className="space-y-4 text-center">
            <div className="text-3xl">✓</div>

            <p className="font-semibold text-green-600">{success}</p>

            <button
              onClick={() => navigate("/login")}
              className="w-full rounded-lg bg-black py-3 text-white hover:bg-gray-800"
            >
              Return to Login
            </button>
          </div>
        )}

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
