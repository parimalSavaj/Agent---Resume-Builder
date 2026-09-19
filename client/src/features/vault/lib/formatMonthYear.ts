const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * Formats a "YYYY-MM" vault date string as "Mon YYYY" (e.g. "Jan 2022") for
 * display. Returns null for empty/invalid input so callers can fall back to
 * their own default.
 */
export function formatMonthYear(value: string | null | undefined): string | null {
  if (!value) return null;
  const [year, month] = value.split("-");
  const monthIndex = Number(month) - 1;
  if (!year || monthIndex < 0 || monthIndex > 11) return null;
  return `${MONTH_LABELS[monthIndex]} ${year}`;
}
