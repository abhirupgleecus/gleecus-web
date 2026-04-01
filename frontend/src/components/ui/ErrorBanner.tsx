interface ErrorBannerProps {
  title?: string;
  message: string;
}

export default function ErrorBanner({ title = "Something went wrong", message }: ErrorBannerProps) {
  return (
    <div
      role="alert"
      className="rounded-lg border border-danger/40 bg-danger/10 p-4 text-danger"
      aria-live="polite"
    >
      <p className="font-medium">{title}</p>
      <p className="mt-1 text-sm">{message}</p>
    </div>
  );
}