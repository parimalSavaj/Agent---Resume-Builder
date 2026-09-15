import { ICertificationsRepository } from '../../../infrastructure/repositories/certifications/certifications.repository.interface';
import { IIdService } from '../../../shared/services/id/id.service.interface';
import { ILoggerService } from '../../../shared/services/logger/logger.service.interface';
import { InternalError } from '../../../shared/core/api-error';
import { CreateCertificationRequestDto, CertificationResponseDto } from './dtos/create-certification.dto';

export class CreateCertificationUseCase {
  constructor(
    private readonly certificationsRepo: ICertificationsRepository,
    private readonly idService: IIdService,
    private readonly logger: ILoggerService,
  ) {}

  async execute(dto: CreateCertificationRequestDto): Promise<CertificationResponseDto> {
    this.logger.info('CreateCertification - started', { userId: dto.userId });

    const id = this.idService.generate();
    const now = new Date();

    try {
      await this.certificationsRepo.create({
        id,
        userId: dto.userId,
        name: dto.name,
        issuer: dto.issuer,
        issueDate: dto.issueDate,
        expirationDate: dto.expirationDate,
        credentialId: dto.credentialId,
        createdAt: now,
        updatedAt: now,
      });
    } catch (error) {
      this.logger.error('CreateCertification - failed to create', error instanceof Error ? error : undefined, {
        userId: dto.userId,
      });
      throw new InternalError('Failed to save certification - please try again');
    }

    this.logger.info('CreateCertification - completed', { userId: dto.userId, id });

    return CertificationResponseDto.toResponse({
      id,
      name: dto.name,
      issuer: dto.issuer,
      issue_date: dto.issueDate,
      expiration_date: dto.expirationDate,
      credential_id: dto.credentialId,
    });
  }
}
