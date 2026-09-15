import { IEducationRepository } from '../../../infrastructure/repositories/education/education.repository.interface';
import { ILoggerService } from '../../../shared/services/logger/logger.service.interface';
import { ListEducationRequestDto, ListEducationResponseDto } from './dtos/list-education.dto';

export class ListEducationUseCase {
  constructor(
    private readonly educationRepo: IEducationRepository,
    private readonly logger: ILoggerService,
  ) {}

  async execute(dto: ListEducationRequestDto): Promise<ListEducationResponseDto> {
    this.logger.info('ListEducation - started', { userId: dto.userId });

    const rows = await this.educationRepo.findAllByUserId(dto.userId);

    return ListEducationResponseDto.toResponse(rows);
  }
}
