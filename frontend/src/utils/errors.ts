import type { FastApiErrorShape, FastApiValidationItem } from "../types/api";

export function mapValidationErrors(errorData: unknown): Record<string, string> {
  const mapped: Record<string, string> = {};
  const detail = (errorData as FastApiErrorShape | undefined)?.detail;

  if (!Array.isArray(detail)) {
    return mapped;
  }

  detail.forEach((item) => {
    const issue = item as FastApiValidationItem;
    const field = issue.loc?.[issue.loc.length - 1];

    if (typeof field === "string") {
      mapped[field] = issue.msg;
    }
  });

  return mapped;
}

export function toErrorMessage(errorData: unknown, fallback: string): string {
  const detail = (errorData as FastApiErrorShape | undefined)?.detail;

  if (typeof detail === "string" && detail.trim()) {
    return detail;
  }

  return fallback;
}