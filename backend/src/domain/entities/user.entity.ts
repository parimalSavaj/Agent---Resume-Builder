export class UserEntity {
  private constructor(
    private readonly _id: string,
    private readonly _username: string,
    private readonly _passwordHash: string,
    private readonly _createdAt: Date,
    private readonly _updatedAt: Date,
  ) {}

  static create(props: {
    id: string;
    username: string;
    passwordHash: string;
  }): UserEntity {
    const now = new Date();
    return new UserEntity(
      props.id,
      props.username,
      props.passwordHash,
      now,
      now,
    );
  }

  static fromRecord(row: {
    id: string;
    username: string;
    password_hash: string;
    created_at: Date;
    updated_at: Date;
  }): UserEntity {
    return new UserEntity(
      row.id,
      row.username,
      row.password_hash,
      row.created_at,
      row.updated_at,
    );
  }

  get id(): string { return this._id; }
  get username(): string { return this._username; }
  get passwordHash(): string { return this._passwordHash; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }
}
