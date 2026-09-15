import { ICertificationsRepository } from '../../../infrastructure/repositories/certifications/certifications.repository.interface';
import { ILoggerService } from '../../../shared/services/logger/logger.service.interface';
import { NotFoundError, InternalError } from '../../../shared/core/api-error';
import { DeleteCertificationRequestDto, DeleteCertificationResponseDto } from './dtos/delete-certification.dto';

export class DeleteCertificationUseCase {
  constructor(
    private readonly certificationsRepo: ICertificationsRepository,
    private readonly logger: ILoggerService,
  ) {}

  async execute(dto: DeleteCertificationRequestDto): Promise<DeleteCertificationResponseDto> {
    this.logger.info('DeleteCertification - started', { userId: dto.userId, id: dto.id });

    const existing = await this.certificationsRepo.findById(dto.id);
    if (!existing || existing.user_id !== dto.userId) {
      this.logger.warn('DeleteCertification - not found or not owned', { userId: dto.userId, id: dto.id });
      throw new NotFoundError('Certification not found');
    }

    try {
      await this.certificationsRepo.delete(dto.id);
    } catch (error) {
      this.logger.error('DeleteCertification - failed to delete', error instanceof Error ? error : undefined, {
        userId: dto.userId,
        id: dto.id,
      });
      throw new InternalError('Failed to delete certification - please try again');
    }

    this.logger.info('DeleteCertification - completed', { userId: dto.userId, id: dto.id });

    return DeleteCertificationResponseDto.toResponse();
  }
}
