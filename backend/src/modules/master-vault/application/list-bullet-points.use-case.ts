import { IBulletPointsRepository } from '../../../infrastructure/repositories/bullet-points/bullet-points.repository.interface';
import { ILoggerService } from '../../../shared/services/logger/logger.service.interface';
import { ListBulletPointsRequestDto, ListBulletPointsResponseDto } from './dtos/list-bullet-points.dto';

export class ListBulletPointsUseCase {
  constructor(
    private readonly bulletPointsRepo: IBulletPointsRepository,
    private readonly logger: ILoggerService,
  ) {}

  async execute(dto: ListBulletPointsRequestDto): Promise<ListBulletPointsResponseDto> {
    this.logger.info('ListBulletPoints - started', { userId: dto.userId });

    const rows = await this.bulletPointsRepo.findAllByUserId(dto.userId, {
      tag: dto.tag,
      parentType: dto.parentType,
      parentId: dto.parentId,
      dateFrom: dto.dateFrom,
      dateTo: dto.dateTo,
    });

    return ListBulletPointsResponseDto.toResponse(rows);
  }
}
