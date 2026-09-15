import { z } from 'zod';

// --- Work Experience ---
export const createWorkExperienceBodySchema = z.object({
  company: z.string().min(1, 'Company is required').max(255),
  title: z.string().min(1, 'Title is required').max(255),
  location: z.string().max(255).nullish(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'startDate must be in YYYY-MM-DD format'),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'endDate must be in YYYY-MM-DD format')
    .nullish(),
});

export const updateWorkExperienceBodySchema = createWorkExperienceBodySchema;

export const workExperienceParamsSchema = z.object({
  id: z.string().uuid(),
});

// --- Project ---
export const createProjectBodySchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  description: z.string().nullish(),
  url: z.string().url('url must be a valid URL').nullish(),
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'startDate must be in YYYY-MM-DD format')
    .nullish(),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'endDate must be in YYYY-MM-DD format')
    .nullish(),
});

export const updateProjectBodySchema = createProjectBodySchema;

export const projectParamsSchema = z.object({
  id: z.string().uuid(),
});

// --- Education ---
export const createEducationBodySchema = z.object({
  institution: z.string().min(1, 'Institution is required').max(255),
  degree: z.string().max(255).nullish(),
  fieldOfStudy: z.string().max(255).nullish(),
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'startDate must be in YYYY-MM-DD format')
    .nullish(),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'endDate must be in YYYY-MM-DD format')
    .nullish(),
});

export const updateEducationBodySchema = createEducationBodySchema;

export const educationParamsSchema = z.object({
  id: z.string().uuid(),
});

// --- Certification ---
export const createCertificationBodySchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  issuer: z.string().max(255).nullish(),
  issueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'issueDate must be in YYYY-MM-DD format')
    .nullish(),
  expirationDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'expirationDate must be in YYYY-MM-DD format')
    .nullish(),
  credentialId: z.string().max(255).nullish(),
});

export const updateCertificationBodySchema = createCertificationBodySchema;

export const certificationParamsSchema = z.object({
  id: z.string().uuid(),
});

// --- Skill ---
export const createSkillBodySchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  category: z.string().max(100).nullish(),
});

export const updateSkillBodySchema = createSkillBodySchema;

export const skillParamsSchema = z.object({
  id: z.string().uuid(),
});

// --- Bullet Point ---
export const createBulletPointBodySchema = z.object({
  parentType: z.enum(['work_experience', 'project']),
  parentId: z.string().uuid(),
  text: z.string().min(1, 'Text is required'),
  tags: z.array(z.string().min(1)).max(20).default([]),
  metric: z.string().max(255).nullish(),
});

export const updateBulletPointBodySchema = z.object({
  text: z.string().min(1, 'Text is required'),
  tags: z.array(z.string().min(1)).max(20).default([]),
  metric: z.string().max(255).nullish(),
});

export const bulletPointParamsSchema = z.object({
  id: z.string().uuid(),
});

export const listBulletPointsQuerySchema = z.object({
  tag: z.string().min(1).optional(),
  parentType: z.enum(['work_experience', 'project']).optional(),
  parentId: z.string().uuid().optional(),
  dateFrom: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'dateFrom must be in YYYY-MM-DD format')
    .optional(),
  dateTo: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'dateTo must be in YYYY-MM-DD format')
    .optional(),
});

// --- Analyze ---
export const analyzeTextBodySchema = z.object({
  text: z.string().min(1, 'Text is required to analyze'),
});
