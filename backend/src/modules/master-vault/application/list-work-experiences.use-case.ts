import { IWorkExperiencesRepository } from '../../../infrastructure/repositories/work-experiences/work-experiences.repository.interface';
import { ILoggerService } from '../../../shared/services/logger/logger.service.interface';
import { ListWorkExperiencesRequestDto, ListWorkExperiencesResponseDto } from './dtos/list-work-experiences.dto';

export class ListWorkExperiencesUseCase {
  constructor(
    private readonly workExperiencesRepo: IWorkExperiencesRepository,
    private readonly logger: ILoggerService,
  ) {}

  async execute(dto: ListWorkExperiencesRequestDto): Promise<ListWorkExperiencesResponseDto> {
    this.logger.info('ListWorkExperiences - started', { userId: dto.userId });

    const rows = await this.workExperiencesRepo.findAllByUserId(dto.userId);

    return ListWorkExperiencesResponseDto.toResponse(rows);
  }
}
