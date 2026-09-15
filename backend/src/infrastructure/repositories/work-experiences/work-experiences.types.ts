export type WorkExperienceRow = {
  id: string;
  user_id: string;
  company: string;
  title: string;
  location: string | null;
  start_date: string;
  end_date: string | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
};
