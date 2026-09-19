import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS } from '../../../shared/constants/status-code.constants';
import { ApiResponse } from '../../../shared/core/api-response';

import { CreateWorkExperienceUseCase } from '../application/create-work-experience.use-case';
import { ListWorkExperiencesUseCase } from '../application/list-work-experiences.use-case';
import { UpdateWorkExperienceUseCase } from '../application/update-work-experience.use-case';
import { DeleteWorkExperienceUseCase } from '../application/delete-work-experience.use-case';

import { CreateProjectUseCase } from '../application/create-project.use-case';
import { ListProjectsUseCase } from '../application/list-projects.use-case';
import { UpdateProjectUseCase } from '../application/update-project.use-case';
import { DeleteProjectUseCase } from '../application/delete-project.use-case';

import { CreateEducationUseCase } from '../application/create-education.use-case';
import { ListEducationUseCase } from '../application/list-education.use-case';
import { UpdateEducationUseCase } from '../application/update-education.use-case';
import { DeleteEducationUseCase } from '../application/delete-education.use-case';

import { CreateCertificationUseCase } from '../application/create-certification.use-case';
import { ListCertificationsUseCase } from '../application/list-certifications.use-case';
import { UpdateCertificationUseCase } from '../application/update-certification.use-case';
import { DeleteCertificationUseCase } from '../application/delete-certification.use-case';

import { CreateSkillUseCase } from '../application/create-skill.use-case';
import { ListSkillsUseCase } from '../application/list-skills.use-case';
import { UpdateSkillUseCase } from '../application/update-skill.use-case';
import { DeleteSkillUseCase } from '../application/delete-skill.use-case';

import { AnalyzeTextUseCase } from '../application/analyze-text.use-case';

import { CreateWorkExperienceRequestDto } from '../application/dtos/create-work-experience.dto';
import { ListWorkExperiencesRequestDto } from '../application/dtos/list-work-experiences.dto';
import { UpdateWorkExperienceRequestDto } from '../application/dtos/update-work-experience.dto';
import { DeleteWorkExperienceRequestDto } from '../application/dtos/delete-work-experience.dto';

import { CreateProjectRequestDto } from '../application/dtos/create-project.dto';
import { ListProjectsRequestDto } from '../application/dtos/list-projects.dto';
import { UpdateProjectRequestDto } from '../application/dtos/update-project.dto';
import { DeleteProjectRequestDto } from '../application/dtos/delete-project.dto';

import { CreateEducationRequestDto } from '../application/dtos/create-education.dto';
import { ListEducationRequestDto } from '../application/dtos/list-education.dto';
import { UpdateEducationRequestDto } from '../application/dtos/update-education.dto';
import { DeleteEducationRequestDto } from '../application/dtos/delete-education.dto';

import { CreateCertificationRequestDto } from '../application/dtos/create-certification.dto';
import { ListCertificationsRequestDto } from '../application/dtos/list-certifications.dto';
import { UpdateCertificationRequestDto } from '../application/dtos/update-certification.dto';
import { DeleteCertificationRequestDto } from '../application/dtos/delete-certification.dto';

import { CreateSkillRequestDto } from '../application/dtos/create-skill.dto';
import { ListSkillsRequestDto } from '../application/dtos/list-skills.dto';
import { UpdateSkillRequestDto } from '../application/dtos/update-skill.dto';
import { DeleteSkillRequestDto } from '../application/dtos/delete-skill.dto';

import { AnalyzeTextRequestDto } from '../application/dtos/analyze-text.dto';

export class MasterVaultController {
  constructor(
    private readonly createWorkExperienceUseCase: CreateWorkExperienceUseCase,
    private readonly listWorkExperiencesUseCase: ListWorkExperiencesUseCase,
    private readonly updateWorkExperienceUseCase: UpdateWorkExperienceUseCase,
    private readonly deleteWorkExperienceUseCase: DeleteWorkExperienceUseCase,

    private readonly createProjectUseCase: CreateProjectUseCase,
    private readonly listProjectsUseCase: ListProjectsUseCase,
    private readonly updateProjectUseCase: UpdateProjectUseCase,
    private readonly deleteProjectUseCase: DeleteProjectUseCase,

    private readonly createEducationUseCase: CreateEducationUseCase,
    private readonly listEducationUseCase: ListEducationUseCase,
    private readonly updateEducationUseCase: UpdateEducationUseCase,
    private readonly deleteEducationUseCase: DeleteEducationUseCase,

    private readonly createCertificationUseCase: CreateCertificationUseCase,
    private readonly listCertificationsUseCase: ListCertificationsUseCase,
    private readonly updateCertificationUseCase: UpdateCertificationUseCase,
    private readonly deleteCertificationUseCase: DeleteCertificationUseCase,

    private readonly createSkillUseCase: CreateSkillUseCase,
    private readonly listSkillsUseCase: ListSkillsUseCase,
    private readonly updateSkillUseCase: UpdateSkillUseCase,
    private readonly deleteSkillUseCase: DeleteSkillUseCase,

    private readonly analyzeTextUseCase: AnalyzeTextUseCase,
  ) {}

  // --- Work Experience ---

  createWorkExperience = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = CreateWorkExperienceRequestDto.fromRequest(req);
      const result = await this.createWorkExperienceUseCase.execute(dto);
      res.status(HTTP_STATUS.CREATED).json(new ApiResponse(HTTP_STATUS.CREATED, result));
    } catch (error) {
      next(error);
    }
  };

  listWorkExperiences = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = ListWorkExperiencesRequestDto.fromRequest(req);
      const result = await this.listWorkExperiencesUseCase.execute(dto);
      res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, result));
    } catch (error) {
      next(error);
    }
  };

  updateWorkExperience = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = UpdateWorkExperienceRequestDto.fromRequest(req);
      const result = await this.updateWorkExperienceUseCase.execute(dto);
      res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, result));
    } catch (error) {
      next(error);
    }
  };

  deleteWorkExperience = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = DeleteWorkExperienceRequestDto.fromRequest(req);
      await this.deleteWorkExperienceUseCase.execute(dto);
      res.status(HTTP_STATUS.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  };

  // --- Project ---

  createProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = CreateProjectRequestDto.fromRequest(req);
      const result = await this.createProjectUseCase.execute(dto);
      res.status(HTTP_STATUS.CREATED).json(new ApiResponse(HTTP_STATUS.CREATED, result));
    } catch (error) {
      next(error);
    }
  };

  listProjects = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = ListProjectsRequestDto.fromRequest(req);
      const result = await this.listProjectsUseCase.execute(dto);
      res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, result));
    } catch (error) {
      next(error);
    }
  };

  updateProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = UpdateProjectRequestDto.fromRequest(req);
      const result = await this.updateProjectUseCase.execute(dto);
      res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, result));
    } catch (error) {
      next(error);
    }
  };

  deleteProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = DeleteProjectRequestDto.fromRequest(req);
      await this.deleteProjectUseCase.execute(dto);
      res.status(HTTP_STATUS.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  };

  // --- Education ---

  createEducation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = CreateEducationRequestDto.fromRequest(req);
      const result = await this.createEducationUseCase.execute(dto);
      res.status(HTTP_STATUS.CREATED).json(new ApiResponse(HTTP_STATUS.CREATED, result));
    } catch (error) {
      next(error);
    }
  };

  listEducation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = ListEducationRequestDto.fromRequest(req);
      const result = await this.listEducationUseCase.execute(dto);
      res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, result));
    } catch (error) {
      next(error);
    }
  };

  updateEducation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = UpdateEducationRequestDto.fromRequest(req);
      const result = await this.updateEducationUseCase.execute(dto);
      res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, result));
    } catch (error) {
      next(error);
    }
  };

  deleteEducation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = DeleteEducationRequestDto.fromRequest(req);
      await this.deleteEducationUseCase.execute(dto);
      res.status(HTTP_STATUS.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  };

  // --- Certification ---

  createCertification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = CreateCertificationRequestDto.fromRequest(req);
      const result = await this.createCertificationUseCase.execute(dto);
      res.status(HTTP_STATUS.CREATED).json(new ApiResponse(HTTP_STATUS.CREATED, result));
    } catch (error) {
      next(error);
    }
  };

  listCertifications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = ListCertificationsRequestDto.fromRequest(req);
      const result = await this.listCertificationsUseCase.execute(dto);
      res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, result));
    } catch (error) {
      next(error);
    }
  };

  updateCertification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = UpdateCertificationRequestDto.fromRequest(req);
      const result = await this.updateCertificationUseCase.execute(dto);
      res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, result));
    } catch (error) {
      next(error);
    }
  };

  deleteCertification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = DeleteCertificationRequestDto.fromRequest(req);
      await this.deleteCertificationUseCase.execute(dto);
      res.status(HTTP_STATUS.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  };

  // --- Skill ---

  createSkill = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = CreateSkillRequestDto.fromRequest(req);
      const result = await this.createSkillUseCase.execute(dto);
      res.status(HTTP_STATUS.CREATED).json(new ApiResponse(HTTP_STATUS.CREATED, result));
    } catch (error) {
      next(error);
    }
  };

  listSkills = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = ListSkillsRequestDto.fromRequest(req);
      const result = await this.listSkillsUseCase.execute(dto);
      res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, result));
    } catch (error) {
      next(error);
    }
  };

  updateSkill = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = UpdateSkillRequestDto.fromRequest(req);
      const result = await this.updateSkillUseCase.execute(dto);
      res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, result));
    } catch (error) {
      next(error);
    }
  };

  deleteSkill = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = DeleteSkillRequestDto.fromRequest(req);
      await this.deleteSkillUseCase.execute(dto);
      res.status(HTTP_STATUS.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  };

  // --- Analyze ---

  analyzeText = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = AnalyzeTextRequestDto.fromRequest(req);
      const result = await this.analyzeTextUseCase.execute(dto);
      res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, result));
    } catch (error) {
      next(error);
    }
  };
}
