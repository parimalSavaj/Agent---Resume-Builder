import { IWorkExperiencesRepository } from '../../../infrastructure/repositories/work-experiences/work-experiences.repository.interface';
import { ILoggerService } from '../../../shared/services/logger/logger.service.interface';
import { NotFoundError, InternalError } from '../../../shared/core/api-error';
import { DeleteWorkExperienceRequestDto, DeleteWorkExperienceResponseDto } from './dtos/delete-work-experience.dto';

export class DeleteWorkExperienceUseCase {
  constructor(
    private readonly workExperiencesRepo: IWorkExperiencesRepository,
    private readonly logger: ILoggerService,
  ) {}

  async execute(dto: DeleteWorkExperienceRequestDto): Promise<DeleteWorkExperienceResponseDto> {
    this.logger.info('DeleteWorkExperience - started', { userId: dto.userId, id: dto.id });

    const existing = await this.workExperiencesRepo.findById(dto.id);
    if (!existing || existing.user_id !== dto.userId) {
      this.logger.warn('DeleteWorkExperience - not found or not owned', { userId: dto.userId, id: dto.id });
      throw new NotFoundError('Work experience not found');
    }

    try {
      await this.workExperiencesRepo.delete(dto.id);
    } catch (error) {
      this.logger.error('DeleteWorkExperience - failed to delete', error instanceof Error ? error : undefined, {
        userId: dto.userId,
        id: dto.id,
      });
      throw new InternalError('Failed to delete work experience - please try again');
    }

    this.logger.info('DeleteWorkExperience - completed', { userId: dto.userId, id: dto.id });

    return DeleteWorkExperienceResponseDto.toResponse();
  }
}
