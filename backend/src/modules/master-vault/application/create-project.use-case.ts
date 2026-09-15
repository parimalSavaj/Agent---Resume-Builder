import { IProjectsRepository } from '../../../infrastructure/repositories/projects/projects.repository.interface';
import { IIdService } from '../../../shared/services/id/id.service.interface';
import { ILoggerService } from '../../../shared/services/logger/logger.service.interface';
import { InternalError } from '../../../shared/core/api-error';
import { CreateProjectRequestDto, ProjectResponseDto } from './dtos/create-project.dto';

export class CreateProjectUseCase {
  constructor(
    private readonly projectsRepo: IProjectsRepository,
    private readonly idService: IIdService,
    private readonly logger: ILoggerService,
  ) {}

  async execute(dto: CreateProjectRequestDto): Promise<ProjectResponseDto> {
    this.logger.info('CreateProject - started', { userId: dto.userId });

    const id = this.idService.generate();
    const now = new Date();

    try {
      await this.projectsRepo.create({
        id,
        userId: dto.userId,
        name: dto.name,
        description: dto.description,
        url: dto.url,
        startDate: dto.startDate,
        endDate: dto.endDate,
        createdAt: now,
        updatedAt: now,
      });
    } catch (error) {
      this.logger.error('CreateProject - failed to create', error instanceof Error ? error : undefined, {
        userId: dto.userId,
      });
      throw new InternalError('Failed to save project - please try again');
    }

    this.logger.info('CreateProject - completed', { userId: dto.userId, id });

    return ProjectResponseDto.toResponse({
      id,
      name: dto.name,
      description: dto.description,
      url: dto.url,
      start_date: dto.startDate,
      end_date: dto.endDate,
    });
  }
}
