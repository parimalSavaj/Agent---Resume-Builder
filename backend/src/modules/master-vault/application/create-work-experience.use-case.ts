import { IWorkExperiencesRepository } from '../../../infrastructure/repositories/work-experiences/work-experiences.repository.interface';
import { IIdService } from '../../../shared/services/id/id.service.interface';
import { ILoggerService } from '../../../shared/services/logger/logger.service.interface';
import { InternalError } from '../../../shared/core/api-error';
import { CreateWorkExperienceRequestDto, WorkExperienceResponseDto } from './dtos/create-work-experience.dto';

export class CreateWorkExperienceUseCase {
  constructor(
    private readonly workExperiencesRepo: IWorkExperiencesRepository,
    private readonly idService: IIdService,
    private readonly logger: ILoggerService,
  ) {}

  async execute(dto: CreateWorkExperienceRequestDto): Promise<WorkExperienceResponseDto> {
    this.logger.info('CreateWorkExperience - started', { userId: dto.userId });

    const id = this.idService.generate();
    const now = new Date();

    try {
      await this.workExperiencesRepo.create({
        id,
        userId: dto.userId,
        company: dto.company,
        title: dto.title,
        location: dto.location,
        description: dto.description,
        startDate: dto.startDate,
        endDate: dto.endDate,
        createdAt: now,
        updatedAt: now,
      });
    } catch (error) {
      this.logger.error('CreateWorkExperience - failed to create', error instanceof Error ? error : undefined, {
        userId: dto.userId,
      });
      throw new InternalError('Failed to save work experience - please try again');
    }

    this.logger.info('CreateWorkExperience - completed', { userId: dto.userId, id });

    return WorkExperienceResponseDto.toResponse({
      id,
      company: dto.company,
      title: dto.title,
      location: dto.location,
      description: dto.description,
      start_date: dto.startDate,
      end_date: dto.endDate,
    });
  }
}
