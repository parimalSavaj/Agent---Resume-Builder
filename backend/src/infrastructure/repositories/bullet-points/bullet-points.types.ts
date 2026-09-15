export type BulletPointRow = {
  id: string;
  user_id: string;
  parent_type: string;
  parent_id: string;
  text: string;
  tags: string[];
  metric: string | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
};
