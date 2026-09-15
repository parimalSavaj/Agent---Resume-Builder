import { IDatabaseService } from '../../shared/services/database/database.service.interface';
import { ILoggerService } from '../../shared/services/logger/logger.service.interface';
import { WorkExperiencesRepository } from '../../infrastructure/repositories/work-experiences/work-experiences.repository';
import { ProjectsRepository } from '../../infrastructure/repositories/projects/projects.repository';
import { EducationRepository } from '../../infrastructure/repositories/education/education.repository';
import { CertificationsRepository } from '../../infrastructure/repositories/certifications/certifications.repository';
import { SkillsRepository } from '../../infrastructure/repositories/skills/skills.repository';
import { BulletPointsRepository } from '../../infrastructure/repositories/bullet-points/bullet-points.repository';
import { OpenRouterExternalService } from '../../infrastructure/external-services/openrouter/openrouter.external-service';
import { IdService } from '../../shared/services/id/id.service';

import { CreateWorkExperienceUseCase } from './application/create-work-experience.use-case';
import { ListWorkExperiencesUseCase } from './application/list-work-experiences.use-case';
import { UpdateWorkExperienceUseCase } from './application/update-work-experience.use-case';
import { DeleteWorkExperienceUseCase } from './application/delete-work-experience.use-case';

import { CreateProjectUseCase } from './application/create-project.use-case';
import { ListProjectsUseCase } from './application/list-projects.use-case';
import { UpdateProjectUseCase } from './application/update-project.use-case';
import { DeleteProjectUseCase } from './application/delete-project.use-case';

import { CreateEducationUseCase } from './application/create-education.use-case';
import { ListEducationUseCase } from './application/list-education.use-case';
import { UpdateEducationUseCase } from './application/update-education.use-case';
import { DeleteEducationUseCase } from './application/delete-education.use-case';

import { CreateCertificationUseCase } from './application/create-certification.use-case';
import { ListCertificationsUseCase } from './application/list-certifications.use-case';
import { UpdateCertificationUseCase } from './application/update-certification.use-case';
import { DeleteCertificationUseCase } from './application/delete-certification.use-case';

import { CreateSkillUseCase } from './application/create-skill.use-case';
import { ListSkillsUseCase } from './application/list-skills.use-case';
import { UpdateSkillUseCase } from './application/update-skill.use-case';
import { DeleteSkillUseCase } from './application/delete-skill.use-case';

import { CreateBulletPointUseCase } from './application/create-bullet-point.use-case';
import { ListBulletPointsUseCase } from './application/list-bullet-points.use-case';
import { UpdateBulletPointUseCase } from './application/update-bullet-point.use-case';
import { DeleteBulletPointUseCase } from './application/delete-bullet-point.use-case';

import { AnalyzeTextUseCase } from './application/analyze-text.use-case';

import { MasterVaultController } from './presentation/master-vault.controller';

export class MasterVaultFactory {
  static create(db: IDatabaseService, logger: ILoggerService): MasterVaultController {
    // Repositories
    const workExperiencesRepo = new WorkExperiencesRepository(db);
    const projectsRepo = new ProjectsRepository(db);
    const educationRepo = new EducationRepository(db);
    const certificationsRepo = new CertificationsRepository(db);
    const skillsRepo = new SkillsRepository(db);
    const bulletPointsRepo = new BulletPointsRepository(db);

    // External services
    const openRouterService = new OpenRouterExternalService(logger);

    // Shared services (singleton already initialised in server.ts)
    const idService = IdService.getInstance();

    // Use cases - Work Experience
    const createWorkExperienceUseCase = new CreateWorkExperienceUseCase(workExperiencesRepo, idService, logger);
    const listWorkExperiencesUseCase = new ListWorkExperiencesUseCase(workExperiencesRepo, logger);
    const updateWorkExperienceUseCase = new UpdateWorkExperienceUseCase(workExperiencesRepo, logger);
    const deleteWorkExperienceUseCase = new DeleteWorkExperienceUseCase(workExperiencesRepo, bulletPointsRepo, logger);

    // Use cases - Project
    const createProjectUseCase = new CreateProjectUseCase(projectsRepo, idService, logger);
    const listProjectsUseCase = new ListProjectsUseCase(projectsRepo, logger);
    const updateProjectUseCase = new UpdateProjectUseCase(projectsRepo, logger);
    const deleteProjectUseCase = new DeleteProjectUseCase(projectsRepo, bulletPointsRepo, logger);

    // Use cases - Education
    const createEducationUseCase = new CreateEducationUseCase(educationRepo, idService, logger);
    const listEducationUseCase = new ListEducationUseCase(educationRepo, logger);
    const updateEducationUseCase = new UpdateEducationUseCase(educationRepo, logger);
    const deleteEducationUseCase = new DeleteEducationUseCase(educationRepo, logger);

    // Use cases - Certification
    const createCertificationUseCase = new CreateCertificationUseCase(certificationsRepo, idService, logger);
    const listCertificationsUseCase = new ListCertificationsUseCase(certificationsRepo, logger);
    const updateCertificationUseCase = new UpdateCertificationUseCase(certificationsRepo, logger);
    const deleteCertificationUseCase = new DeleteCertificationUseCase(certificationsRepo, logger);

    // Use cases - Skill
    const createSkillUseCase = new CreateSkillUseCase(skillsRepo, idService, logger);
    const listSkillsUseCase = new ListSkillsUseCase(skillsRepo, logger);
    const updateSkillUseCase = new UpdateSkillUseCase(skillsRepo, logger);
    const deleteSkillUseCase = new DeleteSkillUseCase(skillsRepo, logger);

    // Use cases - Bullet Point
    const createBulletPointUseCase = new CreateBulletPointUseCase(
      bulletPointsRepo,
      workExperiencesRepo,
      projectsRepo,
      idService,
      logger,
    );
    const listBulletPointsUseCase = new ListBulletPointsUseCase(bulletPointsRepo, logger);
    const updateBulletPointUseCase = new UpdateBulletPointUseCase(bulletPointsRepo, logger);
    const deleteBulletPointUseCase = new DeleteBulletPointUseCase(bulletPointsRepo, logger);

    // Use case - Analyze
    const analyzeTextUseCase = new AnalyzeTextUseCase(openRouterService, logger);

    return new MasterVaultController(
      createWorkExperienceUseCase,
      listWorkExperiencesUseCase,
      updateWorkExperienceUseCase,
      deleteWorkExperienceUseCase,

      createProjectUseCase,
      listProjectsUseCase,
      updateProjectUseCase,
      deleteProjectUseCase,

      createEducationUseCase,
      listEducationUseCase,
      updateEducationUseCase,
      deleteEducationUseCase,

      createCertificationUseCase,
      listCertificationsUseCase,
      updateCertificationUseCase,
      deleteCertificationUseCase,

      createSkillUseCase,
      listSkillsUseCase,
      updateSkillUseCase,
      deleteSkillUseCase,

      createBulletPointUseCase,
      listBulletPointsUseCase,
      updateBulletPointUseCase,
      deleteBulletPointUseCase,

      analyzeTextUseCase,
    );
  }
}
