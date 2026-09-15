import { IEducationRepository } from '../../../infrastructure/repositories/education/education.repository.interface';
import { IIdService } from '../../../shared/services/id/id.service.interface';
import { ILoggerService } from '../../../shared/services/logger/logger.service.interface';
import { InternalError } from '../../../shared/core/api-error';
import { CreateEducationRequestDto, EducationResponseDto } from './dtos/create-education.dto';

export class CreateEducationUseCase {
  constructor(
    private readonly educationRepo: IEducationRepository,
    private readonly idService: IIdService,
    private readonly logger: ILoggerService,
  ) {}

  async execute(dto: CreateEducationRequestDto): Promise<EducationResponseDto> {
    this.logger.info('CreateEducation - started', { userId: dto.userId });

    const id = this.idService.generate();
    const now = new Date();

    try {
      await this.educationRepo.create({
        id,
        userId: dto.userId,
        institution: dto.institution,
        degree: dto.degree,
        fieldOfStudy: dto.fieldOfStudy,
        startDate: dto.startDate,
        endDate: dto.endDate,
        createdAt: now,
        updatedAt: now,
      });
    } catch (error) {
      this.logger.error('CreateEducation - failed to create', error instanceof Error ? error : undefined, {
        userId: dto.userId,
      });
      throw new InternalError('Failed to save education - please try again');
    }

    this.logger.info('CreateEducation - completed', { userId: dto.userId, id });

    return EducationResponseDto.toResponse({
      id,
      institution: dto.institution,
      degree: dto.degree,
      field_of_study: dto.fieldOfStudy,
      start_date: dto.startDate,
      end_date: dto.endDate,
    });
  }
}
