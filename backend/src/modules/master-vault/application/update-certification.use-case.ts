import { ICertificationsRepository } from '../../../infrastructure/repositories/certifications/certifications.repository.interface';
import { ILoggerService } from '../../../shared/services/logger/logger.service.interface';
import { NotFoundError, InternalError } from '../../../shared/core/api-error';
import { UpdateCertificationRequestDto, UpdateCertificationResponseDto } from './dtos/update-certification.dto';

export class UpdateCertificationUseCase {
  constructor(
    private readonly certificationsRepo: ICertificationsRepository,
    private readonly logger: ILoggerService,
  ) {}

  async execute(dto: UpdateCertificationRequestDto): Promise<UpdateCertificationResponseDto> {
    this.logger.info('UpdateCertification - started', { userId: dto.userId, id: dto.id });

    const existing = await this.certificationsRepo.findById(dto.id);
    if (!existing || existing.user_id !== dto.userId) {
      this.logger.warn('UpdateCertification - not found or not owned', { userId: dto.userId, id: dto.id });
      throw new NotFoundError('Certification not found');
    }

    const updatedAt = new Date();

    try {
      await this.certificationsRepo.update(dto.id, {
        name: dto.name,
        issuer: dto.issuer,
        issueDate: dto.issueDate,
        expirationDate: dto.expirationDate,
        credentialId: dto.credentialId,
        updatedAt,
      });
    } catch (error) {
      this.logger.error('UpdateCertification - failed to update', error instanceof Error ? error : undefined, {
        userId: dto.userId,
        id: dto.id,
      });
      throw new InternalError('Failed to update certification - please try again');
    }

    this.logger.info('UpdateCertification - completed', { userId: dto.userId, id: dto.id });

    return UpdateCertificationResponseDto.toResponse({
      id: dto.id,
      name: dto.name,
      issuer: dto.issuer,
      issue_date: dto.issueDate,
      expiration_date: dto.expirationDate,
      credential_id: dto.credentialId,
    });
  }
}
