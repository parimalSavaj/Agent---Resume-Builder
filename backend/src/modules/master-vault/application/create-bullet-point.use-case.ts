import { IBulletPointsRepository } from '../../../infrastructure/repositories/bullet-points/bullet-points.repository.interface';
import { IWorkExperiencesRepository } from '../../../infrastructure/repositories/work-experiences/work-experiences.repository.interface';
import { IProjectsRepository } from '../../../infrastructure/repositories/projects/projects.repository.interface';
import { IIdService } from '../../../shared/services/id/id.service.interface';
import { ILoggerService } from '../../../shared/services/logger/logger.service.interface';
import { ValidationError, NotFoundError, InternalError } from '../../../shared/core/api-error';
import { BulletParentType } from '../../../domain/enums/bullet-parent-type.enum';
import { CreateBulletPointRequestDto, BulletPointResponseDto } from './dtos/create-bullet-point.dto';

export class CreateBulletPointUseCase {
  constructor(
    private readonly bulletPointsRepo: IBulletPointsRepository,
    private readonly workExperiencesRepo: IWorkExperiencesRepository,
    private readonly projectsRepo: IProjectsRepository,
    private readonly idService: IIdService,
    private readonly logger: ILoggerService,
  ) {}

  async execute(dto: CreateBulletPointRequestDto): Promise<BulletPointResponseDto> {
    this.logger.info('CreateBulletPoint - started', { userId: dto.userId, parentType: dto.parentType });

    if (dto.parentType !== BulletParentType.WORK_EXPERIENCE && dto.parentType !== BulletParentType.PROJECT) {
      throw new ValidationError('parentType must be "work_experience" or "project"');
    }

    const parentExists =
      dto.parentType === BulletParentType.WORK_EXPERIENCE
        ? await this.workExperiencesRepo.findById(dto.parentId)
        : await this.projectsRepo.findById(dto.parentId);

    if (!parentExists || parentExists.user_id !== dto.userId) {
      this.logger.warn('CreateBulletPoint - parent not found or not owned', {
        userId: dto.userId,
        parentType: dto.parentType,
        parentId: dto.parentId,
      });
      throw new NotFoundError('Parent job or project not found');
    }

    const id = this.idService.generate();
    const now = new Date();

    try {
      await this.bulletPointsRepo.create({
        id,
        userId: dto.userId,
        parentType: dto.parentType,
        parentId: dto.parentId,
        text: dto.text,
        tags: dto.tags,
        metric: dto.metric,
        createdAt: now,
        updatedAt: now,
      });
    } catch (error) {
      this.logger.error('CreateBulletPoint - failed to create', error instanceof Error ? error : undefined, {
        userId: dto.userId,
      });
      throw new InternalError('Failed to save bullet point - please try again');
    }

    this.logger.info('CreateBulletPoint - completed', { userId: dto.userId, id });

    return BulletPointResponseDto.toResponse({
      id,
      parent_type: dto.parentType,
      parent_id: dto.parentId,
      text: dto.text,
      tags: dto.tags,
      metric: dto.metric,
    });
  }
}
