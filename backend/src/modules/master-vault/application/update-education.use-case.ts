import { IEducationRepository } from '../../../infrastructure/repositories/education/education.repository.interface';
import { ILoggerService } from '../../../shared/services/logger/logger.service.interface';
import { NotFoundError, InternalError } from '../../../shared/core/api-error';
import { UpdateEducationRequestDto, UpdateEducationResponseDto } from './dtos/update-education.dto';

export class UpdateEducationUseCase {
  constructor(
    private readonly educationRepo: IEducationRepository,
    private readonly logger: ILoggerService,
  ) {}

  async execute(dto: UpdateEducationRequestDto): Promise<UpdateEducationResponseDto> {
    this.logger.info('UpdateEducation - started', { userId: dto.userId, id: dto.id });

    const existing = await this.educationRepo.findById(dto.id);
    if (!existing || existing.user_id !== dto.userId) {
      this.logger.warn('UpdateEducation - not found or not owned', { userId: dto.userId, id: dto.id });
      throw new NotFoundError('Education entry not found');
    }

    const updatedAt = new Date();

    try {
      await this.educationRepo.update(dto.id, {
        institution: dto.institution,
        degree: dto.degree,
        fieldOfStudy: dto.fieldOfStudy,
        startDate: dto.startDate,
        endDate: dto.endDate,
        updatedAt,
      });
    } catch (error) {
      this.logger.error('UpdateEducation - failed to update', error instanceof Error ? error : undefined, {
        userId: dto.userId,
        id: dto.id,
      });
      throw new InternalError('Failed to update education - please try again');
    }

    this.logger.info('UpdateEducation - completed', { userId: dto.userId, id: dto.id });

    return UpdateEducationResponseDto.toResponse({
      id: dto.id,
      institution: dto.institution,
      degree: dto.degree,
      field_of_study: dto.fieldOfStudy,
      start_date: dto.startDate,
      end_date: dto.endDate,
    });
  }
}
