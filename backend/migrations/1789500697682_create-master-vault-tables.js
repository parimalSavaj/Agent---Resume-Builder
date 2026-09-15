/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  // --- work_experiences ---
  pgm.createTable("work_experiences", {
    id: {
      type: "uuid",
      primaryKey: true,
    },
    user_id: {
      type: "uuid",
      notNull: true,
      references: "users",
      onDelete: "CASCADE",
    },
    company: {
      type: "varchar(255)",
      notNull: true,
    },
    title: {
      type: "varchar(255)",
      notNull: true,
    },
    location: {
      type: "varchar(255)",
    },
    start_date: {
      type: "date",
      notNull: true,
    },
    end_date: {
      type: "date",
    },
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
    deleted_at: {
      type: "timestamptz",
    },
  });

  pgm.createIndex("work_experiences", "user_id");
  pgm.createIndex("work_experiences", "user_id", {
    name: "idx_work_experiences_active",
    where: "deleted_at IS NULL",
  });

  // --- projects ---
  pgm.createTable("projects", {
    id: {
      type: "uuid",
      primaryKey: true,
    },
    user_id: {
      type: "uuid",
      notNull: true,
      references: "users",
      onDelete: "CASCADE",
    },
    name: {
      type: "varchar(255)",
      notNull: true,
    },
    description: {
      type: "text",
    },
    url: {
      type: "text",
    },
    start_date: {
      type: "date",
    },
    end_date: {
      type: "date",
    },
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
    deleted_at: {
      type: "timestamptz",
    },
  });

  pgm.createIndex("projects", "user_id");
  pgm.createIndex("projects", "user_id", {
    name: "idx_projects_active",
    where: "deleted_at IS NULL",
  });

  // --- education ---
  pgm.createTable("education", {
    id: {
      type: "uuid",
      primaryKey: true,
    },
    user_id: {
      type: "uuid",
      notNull: true,
      references: "users",
      onDelete: "CASCADE",
    },
    institution: {
      type: "varchar(255)",
      notNull: true,
    },
    degree: {
      type: "varchar(255)",
    },
    field_of_study: {
      type: "varchar(255)",
    },
    start_date: {
      type: "date",
    },
    end_date: {
      type: "date",
    },
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
    deleted_at: {
      type: "timestamptz",
    },
  });

  pgm.createIndex("education", "user_id");
  pgm.createIndex("education", "user_id", {
    name: "idx_education_active",
    where: "deleted_at IS NULL",
  });

  // --- certifications ---
  pgm.createTable("certifications", {
    id: {
      type: "uuid",
      primaryKey: true,
    },
    user_id: {
      type: "uuid",
      notNull: true,
      references: "users",
      onDelete: "CASCADE",
    },
    name: {
      type: "varchar(255)",
      notNull: true,
    },
    issuer: {
      type: "varchar(255)",
    },
    issue_date: {
      type: "date",
    },
    expiration_date: {
      type: "date",
    },
    credential_id: {
      type: "varchar(255)",
    },
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
    deleted_at: {
      type: "timestamptz",
    },
  });

  pgm.createIndex("certifications", "user_id");
  pgm.createIndex("certifications", "user_id", {
    name: "idx_certifications_active",
    where: "deleted_at IS NULL",
  });

  // --- skills ---
  pgm.createTable("skills", {
    id: {
      type: "uuid",
      primaryKey: true,
    },
    user_id: {
      type: "uuid",
      notNull: true,
      references: "users",
      onDelete: "CASCADE",
    },
    name: {
      type: "varchar(255)",
      notNull: true,
    },
    category: {
      type: "varchar(100)",
    },
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
    deleted_at: {
      type: "timestamptz",
    },
  });

  pgm.createIndex("skills", "user_id");
  pgm.createIndex("skills", "user_id", {
    name: "idx_skills_active",
    where: "deleted_at IS NULL",
  });

  // --- bullet_points ---
  // Polymorphic child of either a work_experience or a project.
  pgm.createTable("bullet_points", {
    id: {
      type: "uuid",
      primaryKey: true,
    },
    user_id: {
      type: "uuid",
      notNull: true,
      references: "users",
      onDelete: "CASCADE",
    },
    parent_type: {
      type: "varchar(20)",
      notNull: true,
      // No FK constraint possible on a polymorphic reference - parent_id
      // points at either work_experiences.id or projects.id depending on
      // parent_type. Referential integrity for this relation is enforced
      // in the repository/use case layer, not the database.
    },
    parent_id: {
      type: "uuid",
      notNull: true,
    },
    text: {
      type: "text",
      notNull: true,
    },
    tags: {
      type: "text[]",
      notNull: true,
      default: pgm.func("ARRAY[]::text[]"),
    },
    metric: {
      type: "varchar(255)",
    },
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
    deleted_at: {
      type: "timestamptz",
    },
  });

  pgm.addConstraint("bullet_points", "bullet_points_parent_type_check", {
    check: "parent_type IN ('work_experience', 'project')",
  });

  pgm.createIndex("bullet_points", "user_id");
  pgm.createIndex("bullet_points", ["parent_type", "parent_id"]);
  pgm.createIndex("bullet_points", "tags", { method: "gin" });
  pgm.createIndex("bullet_points", "user_id", {
    name: "idx_bullet_points_active",
    where: "deleted_at IS NULL",
  });
};

exports.down = (pgm) => {
  pgm.dropTable("bullet_points");
  pgm.dropTable("skills");
  pgm.dropTable("certifications");
  pgm.dropTable("education");
  pgm.dropTable("projects");
  pgm.dropTable("work_experiences");
};
