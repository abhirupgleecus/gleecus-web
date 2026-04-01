import type { ButtonHTMLAttributes } from "react";

import Spinner from "./Spinner";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white hover:bg-primary-dark px-5 py-2.5 rounded-md font-medium transition-colors",
  secondary:
    "border border-primary text-primary hover:bg-primary/5 px-5 py-2.5 rounded-md font-medium transition-colors",
  danger: "bg-danger text-white hover:bg-danger/90 px-5 py-2.5 rounded-md font-medium transition-colors",
  ghost: "text-neutral-600 hover:text-primary hover:bg-neutral-50 px-5 py-2.5 rounded-md font-medium transition-colors",
};

export default function Button({
  variant = "primary",
  loading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  const isDisabled = loading || disabled;
  const classes = [
    "inline-flex items-center justify-center gap-2",
    variantClasses[variant],
    isDisabled ? "cursor-not-allowed opacity-70" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button disabled={isDisabled} className={classes} {...props}>
      {loading ? <Spinner className="h-4 w-4 border-2" /> : null}
      <span>{children}</span>
    </button>
  );
}