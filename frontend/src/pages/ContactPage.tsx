import ReCAPTCHA from "react-google-recaptcha";
import { FormEvent, useMemo, useRef, useState } from "react";

import { submitContact } from "../api/client";
import { ApiError } from "../api/http";
import Button from "../components/ui/Button";
import ErrorBanner from "../components/ui/ErrorBanner";
import FieldError from "../components/ui/FieldError";
import { mapValidationErrors, toErrorMessage } from "../utils/errors";

interface ContactFormState {
  service_category: string;
  full_name: string;
  business_email: string;
  message: string;
  captcha_token: string;
}

const serviceOptions = [
  "Product Engineering",
  "Cloud Transformation",
  "Data Platforms",
  "Digital Experience",
  "Cybersecurity Enablement",
  "AI & Automation",
];

export default function ContactPage() {
  const recaptchaSiteKeyRaw = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string | undefined;
  const recaptchaSiteKey = recaptchaSiteKeyRaw?.split("#")[0]?.trim();
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const [form, setForm] = useState<ContactFormState>({
    service_category: "",
    full_name: "",
    business_email: "",
    message: "",
    captcha_token: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [bannerError, setBannerError] = useState<string | null>(null);
  const [recaptchaWidgetError, setRecaptchaWidgetError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const hasRecaptcha = useMemo(() => Boolean(recaptchaSiteKey), [recaptchaSiteKey]);

  function validateBeforeSubmit() {
    const errors: Record<string, string> = {};

    if (!form.service_category.trim()) {
      errors.service_category = "Please choose a service category.";
    }

    if (!form.full_name.trim()) {
      errors.full_name = "Full name is required.";
    }

    if (!form.business_email.trim()) {
      errors.business_email = "Business email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.business_email)) {
      errors.business_email = "Enter a valid business email address.";
    }

    if (!form.message.trim()) {
      errors.message = "Message is required.";
    }

    if (!form.captcha_token.trim()) {
      errors.captcha_token = "Please complete reCAPTCHA before submitting.";
    }

    return errors;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const clientErrors = validateBeforeSubmit();
    setFieldErrors(clientErrors);
    setBannerError(null);

    if (Object.keys(clientErrors).length > 0) {
      return;
    }

    setSubmitting(true);

    try {
      await submitContact(form);
      setSubmitted(true);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 422) {
          setFieldErrors((prev) => ({ ...prev, ...mapValidationErrors(err.data) }));
        } else {
          setBannerError(toErrorMessage(err.data, "Unable to submit your inquiry right now. Please try again."));
        }
      } else {
        setBannerError("Unable to submit your inquiry right now. Please try again.");
      }
    } finally {
      setSubmitting(false);

      if (hasRecaptcha) {
        recaptchaRef.current?.reset();
      }

      setForm((prev) => ({
        ...prev,
        captcha_token: "",
      }));
    }
  }

  if (submitted) {
    return (
      <section className="py-16 md:py-24">
        <div className="mx-auto w-full max-w-3xl px-4 md:px-6 lg:px-8">
          <div className="rounded-lg border border-success/40 bg-white p-8 shadow-sm">
            <h1 className="text-3xl font-bold text-neutral-900">Thanks for reaching out</h1>
            <p className="mt-3 text-base text-neutral-600">
              Your message has been submitted successfully. Our team will review your inquiry and get back to you soon.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto w-full max-w-3xl px-4 md:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-neutral-900">Contact Us</h1>
        <p className="mt-3 text-base text-neutral-600">
          Tell us about your business goal. We will connect you with the right Gleecus team.
        </p>

        <form className="mt-8 space-y-4 rounded-lg border border-neutral-200 bg-white p-6 shadow-sm" onSubmit={onSubmit} noValidate>
          {bannerError ? <ErrorBanner message={bannerError} /> : null}

          <div>
            <label htmlFor="service_category" className="mb-1 block text-sm font-medium text-neutral-700">
              Service Category
            </label>
            <select
              id="service_category"
              value={form.service_category}
              onChange={(event) => setForm((prev) => ({ ...prev, service_category: event.target.value }))}
              className={`w-full rounded-lg border px-4 py-2.5 text-base transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                fieldErrors.service_category ? "border-danger focus:ring-danger/40" : "border-neutral-200"
              }`}
            >
              <option value="">Select a service</option>
              {serviceOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <FieldError message={fieldErrors.service_category} />
          </div>

          <div>
            <label htmlFor="full_name" className="mb-1 block text-sm font-medium text-neutral-700">
              Full Name
            </label>
            <input
              id="full_name"
              type="text"
              value={form.full_name}
              onChange={(event) => setForm((prev) => ({ ...prev, full_name: event.target.value }))}
              className={`w-full rounded-lg border px-4 py-2.5 text-base transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                fieldErrors.full_name ? "border-danger focus:ring-danger/40" : "border-neutral-200"
              }`}
            />
            <FieldError message={fieldErrors.full_name} />
          </div>

          <div>
            <label htmlFor="business_email" className="mb-1 block text-sm font-medium text-neutral-700">
              Business Email
            </label>
            <input
              id="business_email"
              type="email"
              value={form.business_email}
              onChange={(event) => setForm((prev) => ({ ...prev, business_email: event.target.value }))}
              className={`w-full rounded-lg border px-4 py-2.5 text-base transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                fieldErrors.business_email ? "border-danger focus:ring-danger/40" : "border-neutral-200"
              }`}
            />
            <FieldError message={fieldErrors.business_email} />
          </div>

          <div>
            <label htmlFor="message" className="mb-1 block text-sm font-medium text-neutral-700">
              Message
            </label>
            <textarea
              id="message"
              rows={6}
              value={form.message}
              onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
              className={`w-full rounded-lg border px-4 py-2.5 text-base transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                fieldErrors.message ? "border-danger focus:ring-danger/40" : "border-neutral-200"
              }`}
            />
            <FieldError message={fieldErrors.message} />
          </div>

          <div>
            {hasRecaptcha ? (
              <>
                {recaptchaWidgetError ? <ErrorBanner message={recaptchaWidgetError} /> : null}
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={recaptchaSiteKey as string}
                  onChange={(token) => {
                    setRecaptchaWidgetError(null);
                    setForm((prev) => ({ ...prev, captcha_token: token ?? "" }));
                  }}
                  onExpired={() => {
                    setForm((prev) => ({ ...prev, captcha_token: "" }));
                  }}
                  onErrored={() => {
                    setRecaptchaWidgetError(
                      "reCAPTCHA configuration error. Use a reCAPTCHA v2 Checkbox site key for this origin (for local testing: localhost).",
                    );
                    setForm((prev) => ({ ...prev, captcha_token: "" }));
                  }}
                />
                <p className="mt-1 text-sm text-neutral-500">
                  If this widget shows key-type errors, your site key is likely not a reCAPTCHA v2 Checkbox key.
                </p>
                <FieldError message={fieldErrors.captcha_token} />
              </>
            ) : (
              <>
                <label htmlFor="captcha_token" className="mb-1 block text-sm font-medium text-neutral-700">
                  reCAPTCHA Token
                </label>
                <input
                  id="captcha_token"
                  type="text"
                  value={form.captcha_token}
                  onChange={(event) => setForm((prev) => ({ ...prev, captcha_token: event.target.value }))}
                  className={`w-full rounded-lg border px-4 py-2.5 text-base transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                    fieldErrors.captcha_token ? "border-danger focus:ring-danger/40" : "border-neutral-200"
                  }`}
                  aria-describedby="captcha-help"
                />
                <p id="captcha-help" className="mt-1 text-sm text-neutral-500">
                  Set <code>VITE_RECAPTCHA_SITE_KEY</code> to render the checkbox widget. This manual field is for local API testing.
                </p>
                <FieldError message={fieldErrors.captcha_token} />
              </>
            )}
          </div>

          <div>
            <Button type="submit" loading={submitting}>
              Submit Inquiry
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}

