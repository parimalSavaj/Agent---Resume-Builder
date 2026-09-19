import { IWorkExperiencesRepository } from '../../../infrastructure/repositories/work-experiences/work-experiences.repository.interface';
import { ILoggerService } from '../../../shared/services/logger/logger.service.interface';
import { NotFoundError, InternalError } from '../../../shared/core/api-error';
import { UpdateWorkExperienceRequestDto, UpdateWorkExperienceResponseDto } from './dtos/update-work-experience.dto';

export class UpdateWorkExperienceUseCase {
  constructor(
    private readonly workExperiencesRepo: IWorkExperiencesRepository,
    private readonly logger: ILoggerService,
  ) {}

  async execute(dto: UpdateWorkExperienceRequestDto): Promise<UpdateWorkExperienceResponseDto> {
    this.logger.info('UpdateWorkExperience - started', { userId: dto.userId, id: dto.id });

    const existing = await this.workExperiencesRepo.findById(dto.id);
    if (!existing || existing.user_id !== dto.userId) {
      this.logger.warn('UpdateWorkExperience - not found or not owned', { userId: dto.userId, id: dto.id });
      throw new NotFoundError('Work experience not found');
    }

    const updatedAt = new Date();

    try {
      await this.workExperiencesRepo.update(dto.id, {
        company: dto.company,
        title: dto.title,
        location: dto.location,
        description: dto.description,
        startDate: dto.startDate,
        endDate: dto.endDate,
        updatedAt,
      });
    } catch (error) {
      this.logger.error('UpdateWorkExperience - failed to update', error instanceof Error ? error : undefined, {
        userId: dto.userId,
        id: dto.id,
      });
      throw new InternalError('Failed to update work experience - please try again');
    }

    this.logger.info('UpdateWorkExperience - completed', { userId: dto.userId, id: dto.id });

    return UpdateWorkExperienceResponseDto.toResponse({
      id: dto.id,
      company: dto.company,
      title: dto.title,
      location: dto.location,
      description: dto.description,
      start_date: dto.startDate,
      end_date: dto.endDate,
    });
  }
}
