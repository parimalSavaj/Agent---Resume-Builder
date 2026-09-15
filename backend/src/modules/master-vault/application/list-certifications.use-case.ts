import { ICertificationsRepository } from '../../../infrastructure/repositories/certifications/certifications.repository.interface';
import { ILoggerService } from '../../../shared/services/logger/logger.service.interface';
import { ListCertificationsRequestDto, ListCertificationsResponseDto } from './dtos/list-certifications.dto';

export class ListCertificationsUseCase {
  constructor(
    private readonly certificationsRepo: ICertificationsRepository,
    private readonly logger: ILoggerService,
  ) {}

  async execute(dto: ListCertificationsRequestDto): Promise<ListCertificationsResponseDto> {
    this.logger.info('ListCertifications - started', { userId: dto.userId });

    const rows = await this.certificationsRepo.findAllByUserId(dto.userId);

    return ListCertificationsResponseDto.toResponse(rows);
  }
}
