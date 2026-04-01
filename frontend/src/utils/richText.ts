import { truncateText } from "./text";

export function htmlToPlainText(html: string): string {
  if (!html) {
    return "";
  }

  if (typeof window === "undefined" || typeof DOMParser === "undefined") {
    return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  return (doc.body.textContent || "").replace(/\s+/g, " ").trim();
}

export function htmlToExcerpt(html: string, maxLength: number): string {
  return truncateText(htmlToPlainText(html), maxLength);
}
