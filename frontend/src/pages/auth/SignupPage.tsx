import { FormEvent, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { signup } from "../../api/client";
import { ApiError } from "../../api/http";
import Button from "../../components/ui/Button";
import FieldError from "../../components/ui/FieldError";
import { toErrorMessage } from "../../utils/errors";

export default function SignupPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const inviteToken = useMemo(() => searchParams.get("token")?.trim() ?? "", [searchParams]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const errors: Record<string, string> = {};

    if (!username.trim()) {
      errors.username = "Username is required.";
    }

    if (!password.trim()) {
      errors.password = "Password is required.";
    }

    if (!confirmPassword.trim()) {
      errors.confirmPassword = "Please confirm your password.";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    if (!inviteToken) {
      errors.token = "Signup token is missing. Please use the invitation link shared with you.";
    }

    setFieldErrors(errors);
    setFormError(null);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setSubmitting(true);

    try {
      await signup(inviteToken, { username, password });
      navigate("/login", { replace: true, state: { signupSuccess: true } });
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 410) {
          setFormError("This invitation link has expired. Please request a new invitation from the administrator.");
        } else if (err.status === 409) {
          const detail = toErrorMessage(err.data, "Invitation already used.");
          if (detail.toLowerCase().includes("user already exists")) {
            setFormError("An account with this invitation already exists. Please log in instead.");
          } else {
            setFormError("This invitation link has already been used.");
          }
        } else if (err.status === 404) {
          setFormError("This invitation token is invalid or no longer available.");
        } else {
          setFormError(toErrorMessage(err.data, "Signup failed. Please try again."));
        }
      } else {
        setFormError("Signup failed. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-lg border border-neutral-200 bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-bold text-neutral-900">Complete Signup</h1>
      <p className="mt-2 text-sm text-neutral-500">Set your username and password to activate your invited account.</p>

      <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
        <div>
          <label htmlFor="username" className="mb-1 block text-sm font-medium text-neutral-700">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className={`w-full rounded-lg border px-4 py-2.5 text-base transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 ${
              fieldErrors.username ? "border-danger focus:ring-danger/40" : "border-neutral-200"
            }`}
          />
          <FieldError message={fieldErrors.username} />
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

        <div>
          <label htmlFor="confirm_password" className="mb-1 block text-sm font-medium text-neutral-700">
            Confirm Password
          </label>
          <input
            id="confirm_password"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className={`w-full rounded-lg border px-4 py-2.5 text-base transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 ${
              fieldErrors.confirmPassword ? "border-danger focus:ring-danger/40" : "border-neutral-200"
            }`}
          />
          <FieldError message={fieldErrors.confirmPassword} />
        </div>

        {fieldErrors.token ? <p className="text-sm text-danger">{fieldErrors.token}</p> : null}
        {formError ? <p className="text-sm text-danger">{formError}</p> : null}

        <Button type="submit" className="w-full" loading={submitting}>
          Create Account
        </Button>
      </form>
    </div>
  );
}