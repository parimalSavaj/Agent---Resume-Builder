import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MonthYearPickerProps {
  /** Stored/transmitted as "YYYY-MM" (no day component at all) to match the backend's varchar(7) column, or null/empty when unset. */
  value: string | null;
  onChange: (value: string | null) => void;
  disabled?: boolean;
  /** How many years back from the current year to offer. Defaults to a range wide enough for education/work history. */
  yearsBack?: number;
  /** How many years forward from the current year to offer (useful for expected graduation dates, etc). */
  yearsForward?: number;
}

const MONTHS = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

function parseValue(value: string | null): { month: string; year: string } {
  if (!value) return { month: "", year: "" };
  const [year, month] = value.split("-");
  return { month: month ?? "", year: year ?? "" };
}

function buildYears(yearsBack: number, yearsForward: number): string[] {
  const currentYear = new Date().getFullYear();
  const years: string[] = [];
  for (let y = currentYear + yearsForward; y >= currentYear - yearsBack; y--) {
    years.push(String(y));
  }
  return years;
}

/**
 * Month + year picker that reads/writes the same "YYYY-MM" string shape the
 * backend's varchar(7) columns store - there is no day component anywhere in
 * this value, by design, since resume dates only ever need month-level
 * precision and a fabricated day risks leaking into rendered output later.
 * Kept as a shared component so Work Experience, Projects, and Education all
 * use identical date UX.
 *
 * Month and year are picked independently (two separate dropdowns), so this
 * component tracks the in-progress selection in local state and only calls
 * onChange once both are known - it must NOT derive the "other" field from
 * the last committed value, since that value is still null/incomplete while
 * the user is partway through picking (that bug used to wipe out whichever
 * field was picked first).
 */
export function MonthYearPicker({
  value,
  onChange,
  disabled,
  yearsBack = 60,
  yearsForward = 10,
}: MonthYearPickerProps) {
  const [pending, setPending] = useState(() => parseValue(value));
  const years = buildYears(yearsBack, yearsForward);

  // Keep local selection in sync if the parent resets/overwrites the value
  // (e.g. switching which entry is being edited, or the "currently work here"
  // checkbox clearing the end date).
  useEffect(() => {
    setPending(parseValue(value));
  }, [value]);

  const commit = (nextMonth: string, nextYear: string) => {
    setPending({ month: nextMonth, year: nextYear });
    if (nextMonth && nextYear) {
      onChange(`${nextYear}-${nextMonth}`);
    } else {
      onChange(null);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      <Select
        value={pending.month || undefined}
        onValueChange={(nextMonth) => commit(nextMonth, pending.year)}
        disabled={disabled}
      >
        <SelectTrigger>
          <SelectValue placeholder="Month" />
        </SelectTrigger>
        <SelectContent>
          {MONTHS.map((m) => (
            <SelectItem key={m.value} value={m.value}>
              {m.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={pending.year || undefined}
        onValueChange={(nextYear) => commit(pending.month, nextYear)}
        disabled={disabled}
      >
        <SelectTrigger>
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent>
          {years.map((y) => (
            <SelectItem key={y} value={y}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
