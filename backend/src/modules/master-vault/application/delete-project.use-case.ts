import { IProjectsRepository } from '../../../infrastructure/repositories/projects/projects.repository.interface';
import { IBulletPointsRepository } from '../../../infrastructure/repositories/bullet-points/bullet-points.repository.interface';
import { ILoggerService } from '../../../shared/services/logger/logger.service.interface';
import { NotFoundError, InternalError } from '../../../shared/core/api-error';
import { BulletParentType } from '../../../domain/enums/bullet-parent-type.enum';
import { DeleteProjectRequestDto, DeleteProjectResponseDto } from './dtos/delete-project.dto';

export class DeleteProjectUseCase {
  constructor(
    private readonly projectsRepo: IProjectsRepository,
    private readonly bulletPointsRepo: IBulletPointsRepository,
    private readonly logger: ILoggerService,
  ) {}

  async execute(dto: DeleteProjectRequestDto): Promise<DeleteProjectResponseDto> {
    this.logger.info('DeleteProject - started', { userId: dto.userId, id: dto.id });

    const existing = await this.projectsRepo.findById(dto.id);
    if (!existing || existing.user_id !== dto.userId) {
      this.logger.warn('DeleteProject - not found or not owned', { userId: dto.userId, id: dto.id });
      throw new NotFoundError('Project not found');
    }

    try {
      const bullets = await this.bulletPointsRepo.findByParent(BulletParentType.PROJECT, dto.id);
      await Promise.all(bullets.map((bullet) => this.bulletPointsRepo.delete(bullet.id)));
      await this.projectsRepo.delete(dto.id);
    } catch (error) {
      this.logger.error('DeleteProject - failed to delete', error instanceof Error ? error : undefined, {
        userId: dto.userId,
        id: dto.id,
      });
      throw new InternalError('Failed to delete project - please try again');
    }

    this.logger.info('DeleteProject - completed', { userId: dto.userId, id: dto.id });

    return DeleteProjectResponseDto.toResponse();
  }
}
