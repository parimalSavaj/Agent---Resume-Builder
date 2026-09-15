import { IEducationRepository } from '../../../infrastructure/repositories/education/education.repository.interface';
import { ILoggerService } from '../../../shared/services/logger/logger.service.interface';
import { NotFoundError, InternalError } from '../../../shared/core/api-error';
import { DeleteEducationRequestDto, DeleteEducationResponseDto } from './dtos/delete-education.dto';

export class DeleteEducationUseCase {
  constructor(
    private readonly educationRepo: IEducationRepository,
    private readonly logger: ILoggerService,
  ) {}

  async execute(dto: DeleteEducationRequestDto): Promise<DeleteEducationResponseDto> {
    this.logger.info('DeleteEducation - started', { userId: dto.userId, id: dto.id });

    const existing = await this.educationRepo.findById(dto.id);
    if (!existing || existing.user_id !== dto.userId) {
      this.logger.warn('DeleteEducation - not found or not owned', { userId: dto.userId, id: dto.id });
      throw new NotFoundError('Education entry not found');
    }

    try {
      await this.educationRepo.delete(dto.id);
    } catch (error) {
      this.logger.error('DeleteEducation - failed to delete', error instanceof Error ? error : undefined, {
        userId: dto.userId,
        id: dto.id,
      });
      throw new InternalError('Failed to delete education - please try again');
    }

    this.logger.info('DeleteEducation - completed', { userId: dto.userId, id: dto.id });

    return DeleteEducationResponseDto.toResponse();
  }
}
