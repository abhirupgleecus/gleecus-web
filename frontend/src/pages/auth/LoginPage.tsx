import { FormEvent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { login as loginRequest } from "../../api/client";
import { ApiError } from "../../api/http";
import Button from "../../components/ui/Button";
import FieldError from "../../components/ui/FieldError";
import Toast from "../../components/ui/Toast";
import { useAuth } from "../../context/AuthContext";
import { toErrorMessage } from "../../utils/errors";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(Boolean(location.state?.signupSuccess));

  useEffect(() => {
    if (!showToast) {
      return;
    }

    const timer = window.setTimeout(() => {
      setShowToast(false);
      navigate(location.pathname, { replace: true, state: {} });
    }, 3500);

    return () => window.clearTimeout(timer);
  }, [location.pathname, navigate, showToast]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const errors: Record<string, string> = {};

    if (!email.trim()) {
      errors.email = "Email is required.";
    }

    if (!password.trim()) {
      errors.password = "Password is required.";
    }

    setFieldErrors(errors);
    setFormError(null);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setSubmitting(true);

    try {
      const response = await loginRequest({ email, password });
      login(response.access_token);
      navigate("/admin/publish", { replace: true });
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.data) {
          setFormError(toErrorMessage(err.data, err.message || "Login failed. Please try again."));
        } else {
          setFormError(err.message || "Login failed. Please try again.");
        }
      } else {
        setFormError("Login failed. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {showToast ? <Toast message="Signup successful. You can now log in." /> : null}

      <div className="w-full max-w-md rounded-lg border border-neutral-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-neutral-900">Admin Login</h1>
        <p className="mt-2 text-sm text-neutral-500">Use your invited account credentials to continue.</p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-neutral-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={`w-full rounded-lg border px-4 py-2.5 text-base transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                fieldErrors.email ? "border-danger focus:ring-danger/40" : "border-neutral-200"
              }`}
            />
            <FieldError message={fieldErrors.email} />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-neutral-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={`w-full rounded-lg border px-4 py-2.5 text-base transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                fieldErrors.password ? "border-danger focus:ring-danger/40" : "border-neutral-200"
              }`}
            />
            <FieldError message={fieldErrors.password} />
          </div>

          <p className="text-sm text-neutral-500">Login uses your seeded email address, not username.</p>
          {formError ? <p className="text-sm text-danger">{formError}</p> : null}

          <Button type="submit" className="w-full" loading={submitting}>
            Log In
          </Button>
        </form>
      </div>
    </>
  );
}
