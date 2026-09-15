export type CertificationRow = {
  id: string;
  user_id: string;
  name: string;
  issuer: string | null;
  issue_date: string | null;
  expiration_date: string | null;
  credential_id: string | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
};
