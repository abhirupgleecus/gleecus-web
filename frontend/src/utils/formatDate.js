export function formatDate(value) {
  const raw = typeof value === "string" ? value : value.toISOString();
  const normalized = typeof value === "string" && !raw.endsWith("Z") ? `${raw}Z` : raw;
  const date = new Date(normalized);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
