import { IProjectsRepository } from '../../../infrastructure/repositories/projects/projects.repository.interface';
import { ILoggerService } from '../../../shared/services/logger/logger.service.interface';
import { NotFoundError, InternalError } from '../../../shared/core/api-error';
import { UpdateProjectRequestDto, UpdateProjectResponseDto } from './dtos/update-project.dto';

export class UpdateProjectUseCase {
  constructor(
    private readonly projectsRepo: IProjectsRepository,
    private readonly logger: ILoggerService,
  ) {}

  async execute(dto: UpdateProjectRequestDto): Promise<UpdateProjectResponseDto> {
    this.logger.info('UpdateProject - started', { userId: dto.userId, id: dto.id });

    const existing = await this.projectsRepo.findById(dto.id);
    if (!existing || existing.user_id !== dto.userId) {
      this.logger.warn('UpdateProject - not found or not owned', { userId: dto.userId, id: dto.id });
      throw new NotFoundError('Project not found');
    }

    const updatedAt = new Date();

    try {
      await this.projectsRepo.update(dto.id, {
        name: dto.name,
        description: dto.description,
        url: dto.url,
        startDate: dto.startDate,
        endDate: dto.endDate,
        updatedAt,
      });
    } catch (error) {
      this.logger.error('UpdateProject - failed to update', error instanceof Error ? error : undefined, {
        userId: dto.userId,
        id: dto.id,
      });
      throw new InternalError('Failed to update project - please try again');
    }

    this.logger.info('UpdateProject - completed', { userId: dto.userId, id: dto.id });

    return UpdateProjectResponseDto.toResponse({
      id: dto.id,
      name: dto.name,
      description: dto.description,
      url: dto.url,
      start_date: dto.startDate,
      end_date: dto.endDate,
    });
  }
}
