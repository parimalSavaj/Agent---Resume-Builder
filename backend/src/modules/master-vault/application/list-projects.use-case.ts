import { IProjectsRepository } from '../../../infrastructure/repositories/projects/projects.repository.interface';
import { ILoggerService } from '../../../shared/services/logger/logger.service.interface';
import { ListProjectsRequestDto, ListProjectsResponseDto } from './dtos/list-projects.dto';

export class ListProjectsUseCase {
  constructor(
    private readonly projectsRepo: IProjectsRepository,
    private readonly logger: ILoggerService,
  ) {}

  async execute(dto: ListProjectsRequestDto): Promise<ListProjectsResponseDto> {
    this.logger.info('ListProjects - started', { userId: dto.userId });

    const rows = await this.projectsRepo.findAllByUserId(dto.userId);

    return ListProjectsResponseDto.toResponse(rows);
  }
}
