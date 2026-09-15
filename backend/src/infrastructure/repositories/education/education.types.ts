export type EducationRow = {
  id: string;
  user_id: string;
  institution: string;
  degree: string | null;
  field_of_study: string | null;
  start_date: string | null;
  end_date: string | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
};
