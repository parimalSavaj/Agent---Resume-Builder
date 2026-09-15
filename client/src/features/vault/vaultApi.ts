import { apiClient } from "../../lib/apiClient";
import type {
  WorkExperience,
  Project,
  Education,
  Certification,
  Skill,
  BulletPoint,
  BulletPointFilters,
} from "./types";

// --- Work Experience ---

export interface WorkExperienceInput {
  company: string;
  title: string;
  location: string | null;
  startDate: string;
  endDate: string | null;
}

export async function listWorkExperiences(): Promise<WorkExperience[]> {
  const { data } = await apiClient.get<{ data: { items: WorkExperience[] } }>("/vault/work-experiences");
  return data.data.items;
}

export async function createWorkExperience(input: WorkExperienceInput): Promise<WorkExperience> {
  const { data } = await apiClient.post<{ data: WorkExperience }>("/vault/work-experiences", input);
  return data.data;
}

export async function updateWorkExperience(id: string, input: WorkExperienceInput): Promise<WorkExperience> {
  const { data } = await apiClient.put<{ data: WorkExperience }>(`/vault/work-experiences/${id}`, input);
  return data.data;
}

export async function deleteWorkExperience(id: string): Promise<void> {
  await apiClient.delete(`/vault/work-experiences/${id}`);
}

// --- Project ---

export interface ProjectInput {
  name: string;
  description: string | null;
  url: string | null;
  startDate: string | null;
  endDate: string | null;
}

export async function listProjects(): Promise<Project[]> {
  const { data } = await apiClient.get<{ data: { items: Project[] } }>("/vault/projects");
  return data.data.items;
}

export async function createProject(input: ProjectInput): Promise<Project> {
  const { data } = await apiClient.post<{ data: Project }>("/vault/projects", input);
  return data.data;
}

export async function updateProject(id: string, input: ProjectInput): Promise<Project> {
  const { data } = await apiClient.put<{ data: Project }>(`/vault/projects/${id}`, input);
  return data.data;
}

export async function deleteProject(id: string): Promise<void> {
  await apiClient.delete(`/vault/projects/${id}`);
}

// --- Education ---

export interface EducationInput {
  institution: string;
  degree: string | null;
  fieldOfStudy: string | null;
  startDate: string | null;
  endDate: string | null;
}

export async function listEducation(): Promise<Education[]> {
  const { data } = await apiClient.get<{ data: { items: Education[] } }>("/vault/education");
  return data.data.items;
}

export async function createEducation(input: EducationInput): Promise<Education> {
  const { data } = await apiClient.post<{ data: Education }>("/vault/education", input);
  return data.data;
}

export async function updateEducation(id: string, input: EducationInput): Promise<Education> {
  const { data } = await apiClient.put<{ data: Education }>(`/vault/education/${id}`, input);
  return data.data;
}

export async function deleteEducation(id: string): Promise<void> {
  await apiClient.delete(`/vault/education/${id}`);
}

// --- Certification ---

export interface CertificationInput {
  name: string;
  issuer: string | null;
  issueDate: string | null;
  expirationDate: string | null;
  credentialId: string | null;
}

export async function listCertifications(): Promise<Certification[]> {
  const { data } = await apiClient.get<{ data: { items: Certification[] } }>("/vault/certifications");
  return data.data.items;
}

export async function createCertification(input: CertificationInput): Promise<Certification> {
  const { data } = await apiClient.post<{ data: Certification }>("/vault/certifications", input);
  return data.data;
}

export async function updateCertification(id: string, input: CertificationInput): Promise<Certification> {
  const { data } = await apiClient.put<{ data: Certification }>(`/vault/certifications/${id}`, input);
  return data.data;
}

export async function deleteCertification(id: string): Promise<void> {
  await apiClient.delete(`/vault/certifications/${id}`);
}

// --- Skill ---

export interface SkillInput {
  name: string;
  category: string | null;
}

export async function listSkills(): Promise<Skill[]> {
  const { data } = await apiClient.get<{ data: { items: Skill[] } }>("/vault/skills");
  return data.data.items;
}

export async function createSkill(input: SkillInput): Promise<Skill> {
  const { data } = await apiClient.post<{ data: Skill }>("/vault/skills", input);
  return data.data;
}

export async function updateSkill(id: string, input: SkillInput): Promise<Skill> {
  const { data } = await apiClient.put<{ data: Skill }>(`/vault/skills/${id}`, input);
  return data.data;
}

export async function deleteSkill(id: string): Promise<void> {
  await apiClient.delete(`/vault/skills/${id}`);
}

// --- Bullet Point ---

export interface BulletPointInput {
  parentType: "work_experience" | "project";
  parentId: string;
  text: string;
  tags: string[];
  metric: string | null;
}

export interface BulletPointUpdateInput {
  text: string;
  tags: string[];
  metric: string | null;
}

export async function listBulletPoints(filters?: BulletPointFilters): Promise<BulletPoint[]> {
  const { data } = await apiClient.get<{ data: { items: BulletPoint[] } }>("/vault/bullet-points", {
    params: filters,
  });
  return data.data.items;
}

export async function createBulletPoint(input: BulletPointInput): Promise<BulletPoint> {
  const { data } = await apiClient.post<{ data: BulletPoint }>("/vault/bullet-points", input);
  return data.data;
}

export async function updateBulletPoint(id: string, input: BulletPointUpdateInput): Promise<BulletPoint> {
  const { data } = await apiClient.put<{ data: BulletPoint }>(`/vault/bullet-points/${id}`, input);
  return data.data;
}

export async function deleteBulletPoint(id: string): Promise<void> {
  await apiClient.delete(`/vault/bullet-points/${id}`);
}

// --- Analyze ---

export interface AnalyzeTextResult {
  originalText: string;
  correctedText: string;
}

export async function analyzeText(text: string): Promise<AnalyzeTextResult> {
  const { data } = await apiClient.post<{ data: AnalyzeTextResult }>("/vault/analyze", { text });
  return data.data;
}
