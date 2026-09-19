/* eslint-disable camelcase */

// Work experience, project, and education dates only ever need month-level
// precision on a resume (nobody lists the exact day they started a job).
// Storing them as a SQL `date` forced a fabricated day-of-month (always "01")
// into the value, which is not a real fact and risks leaking into any future
// output (rendered resume text, matching-engine prompts) as if it were one.
//
// Switching to varchar(7) storing "YYYY-MM" makes it structurally impossible
// to store or read a day component - there's no column space for it.

const TABLES = ["work_experiences", "projects", "education"];

exports.shorthands = undefined;

exports.up = (pgm) => {
  for (const table of TABLES) {
    pgm.alterColumn(table, "start_date", {
      type: "varchar(7)",
      using: "to_char(start_date, 'YYYY-MM')",
    });
    pgm.alterColumn(table, "end_date", {
      type: "varchar(7)",
      using: "to_char(end_date, 'YYYY-MM')",
    });
  }
};

exports.down = (pgm) => {
  for (const table of TABLES) {
    // Reversing back to `date` re-introduces a day component. There is no
    // real day to recover, so the 1st of the month is used - matching the
    // convention this column used before this migration originally ran.
    // Both columns are guarded for NULL: work_experiences.start_date is the
    // only NOT NULL column among the six, but the CASE is harmless either way.
    pgm.alterColumn(table, "start_date", {
      type: "date",
      using: "CASE WHEN start_date IS NULL THEN NULL ELSE to_date(start_date || '-01', 'YYYY-MM-DD') END",
    });
    pgm.alterColumn(table, "end_date", {
      type: "date",
      using: "CASE WHEN end_date IS NULL THEN NULL ELSE to_date(end_date || '-01', 'YYYY-MM-DD') END",
    });
  }
};
