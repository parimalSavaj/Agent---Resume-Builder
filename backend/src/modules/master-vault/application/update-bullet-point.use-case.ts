import { IBulletPointsRepository } from '../../../infrastructure/repositories/bullet-points/bullet-points.repository.interface';
import { ILoggerService } from '../../../shared/services/logger/logger.service.interface';
import { NotFoundError, InternalError } from '../../../shared/core/api-error';
import { UpdateBulletPointRequestDto, UpdateBulletPointResponseDto } from './dtos/update-bullet-point.dto';

export class UpdateBulletPointUseCase {
  constructor(
    private readonly bulletPointsRepo: IBulletPointsRepository,
    private readonly logger: ILoggerService,
  ) {}

  async execute(dto: UpdateBulletPointRequestDto): Promise<UpdateBulletPointResponseDto> {
    this.logger.info('UpdateBulletPoint - started', { userId: dto.userId, id: dto.id });

    const existing = await this.bulletPointsRepo.findById(dto.id);
    if (!existing || existing.user_id !== dto.userId) {
      this.logger.warn('UpdateBulletPoint - not found or not owned', { userId: dto.userId, id: dto.id });
      throw new NotFoundError('Bullet point not found');
    }

    const updatedAt = new Date();

    try {
      await this.bulletPointsRepo.update(dto.id, { text: dto.text, tags: dto.tags, metric: dto.metric, updatedAt });
    } catch (error) {
      this.logger.error('UpdateBulletPoint - failed to update', error instanceof Error ? error : undefined, {
        userId: dto.userId,
        id: dto.id,
      });
      throw new InternalError('Failed to update bullet point - please try again');
    }

    this.logger.info('UpdateBulletPoint - completed', { userId: dto.userId, id: dto.id });

    return UpdateBulletPointResponseDto.toResponse({
      id: dto.id,
      parent_type: existing.parent_type,
      parent_id: existing.parent_id,
      text: dto.text,
      tags: dto.tags,
      metric: dto.metric,
    });
  }
}
