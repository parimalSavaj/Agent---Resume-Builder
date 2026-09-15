export type ProjectRow = {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  url: string | null;
  start_date: string | null;
  end_date: string | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
};
