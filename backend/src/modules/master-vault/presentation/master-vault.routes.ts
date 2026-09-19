import { Router } from 'express';
import { IDatabaseService } from '../../../shared/services/database/database.service.interface';
import { ILoggerService } from '../../../shared/services/logger/logger.service.interface';
import { IJwtService } from '../../../shared/services/jwt/jwt.service.interface';
import { AuthMiddleware } from '../../../shared/middlewares/auth.middleware';
import { ValidationMiddleware } from '../../../shared/middlewares/validate.middleware';
import { MasterVaultFactory } from '../master-vault.factory';
import {
  createWorkExperienceBodySchema,
  updateWorkExperienceBodySchema,
  workExperienceParamsSchema,
  createProjectBodySchema,
  updateProjectBodySchema,
  projectParamsSchema,
  createEducationBodySchema,
  updateEducationBodySchema,
  educationParamsSchema,
  createCertificationBodySchema,
  updateCertificationBodySchema,
  certificationParamsSchema,
  createSkillBodySchema,
  updateSkillBodySchema,
  skillParamsSchema,
  analyzeTextBodySchema,
} from './master-vault.validation';

export class MasterVaultRoutes {
  private readonly router: Router;
  private readonly controller;

  constructor(db: IDatabaseService, logger: ILoggerService, jwt: IJwtService) {
    this.router = Router();
    this.controller = MasterVaultFactory.create(db, logger);
    this.setupRoutes(jwt);
  }

  private setupRoutes(jwt: IJwtService): void {
    const authenticate = AuthMiddleware.authenticate(jwt);

    // --- Work Experience ---
    this.router.post(
      '/work-experiences',
      authenticate,
      ValidationMiddleware.validateBody(createWorkExperienceBodySchema),
      this.controller.createWorkExperience,
    );
    this.router.get('/work-experiences', authenticate, this.controller.listWorkExperiences);
    this.router.put(
      '/work-experiences/:id',
      authenticate,
      ValidationMiddleware.validateParams(workExperienceParamsSchema),
      ValidationMiddleware.validateBody(updateWorkExperienceBodySchema),
      this.controller.updateWorkExperience,
    );
    this.router.delete(
      '/work-experiences/:id',
      authenticate,
      ValidationMiddleware.validateParams(workExperienceParamsSchema),
      this.controller.deleteWorkExperience,
    );

    // --- Project ---
    this.router.post(
      '/projects',
      authenticate,
      ValidationMiddleware.validateBody(createProjectBodySchema),
      this.controller.createProject,
    );
    this.router.get('/projects', authenticate, this.controller.listProjects);
    this.router.put(
      '/projects/:id',
      authenticate,
      ValidationMiddleware.validateParams(projectParamsSchema),
      ValidationMiddleware.validateBody(updateProjectBodySchema),
      this.controller.updateProject,
    );
    this.router.delete(
      '/projects/:id',
      authenticate,
      ValidationMiddleware.validateParams(projectParamsSchema),
      this.controller.deleteProject,
    );

    // --- Education ---
    this.router.post(
      '/education',
      authenticate,
      ValidationMiddleware.validateBody(createEducationBodySchema),
      this.controller.createEducation,
    );
    this.router.get('/education', authenticate, this.controller.listEducation);
    this.router.put(
      '/education/:id',
      authenticate,
      ValidationMiddleware.validateParams(educationParamsSchema),
      ValidationMiddleware.validateBody(updateEducationBodySchema),
      this.controller.updateEducation,
    );
    this.router.delete(
      '/education/:id',
      authenticate,
      ValidationMiddleware.validateParams(educationParamsSchema),
      this.controller.deleteEducation,
    );

    // --- Certification ---
    this.router.post(
      '/certifications',
      authenticate,
      ValidationMiddleware.validateBody(createCertificationBodySchema),
      this.controller.createCertification,
    );
    this.router.get('/certifications', authenticate, this.controller.listCertifications);
    this.router.put(
      '/certifications/:id',
      authenticate,
      ValidationMiddleware.validateParams(certificationParamsSchema),
      ValidationMiddleware.validateBody(updateCertificationBodySchema),
      this.controller.updateCertification,
    );
    this.router.delete(
      '/certifications/:id',
      authenticate,
      ValidationMiddleware.validateParams(certificationParamsSchema),
      this.controller.deleteCertification,
    );

    // --- Skill ---
    this.router.post(
      '/skills',
      authenticate,
      ValidationMiddleware.validateBody(createSkillBodySchema),
      this.controller.createSkill,
    );
    this.router.get('/skills', authenticate, this.controller.listSkills);
    this.router.put(
      '/skills/:id',
      authenticate,
      ValidationMiddleware.validateParams(skillParamsSchema),
      ValidationMiddleware.validateBody(updateSkillBodySchema),
      this.controller.updateSkill,
    );
    this.router.delete(
      '/skills/:id',
      authenticate,
      ValidationMiddleware.validateParams(skillParamsSchema),
      this.controller.deleteSkill,
    );

    // --- Analyze ---
    this.router.post(
      '/analyze',
      authenticate,
      ValidationMiddleware.validateBody(analyzeTextBodySchema),
      this.controller.analyzeText,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
