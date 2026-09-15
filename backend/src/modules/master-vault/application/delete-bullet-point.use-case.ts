import { IBulletPointsRepository } from '../../../infrastructure/repositories/bullet-points/bullet-points.repository.interface';
import { ILoggerService } from '../../../shared/services/logger/logger.service.interface';
import { NotFoundError, InternalError } from '../../../shared/core/api-error';
import { DeleteBulletPointRequestDto, DeleteBulletPointResponseDto } from './dtos/delete-bullet-point.dto';

export class DeleteBulletPointUseCase {
  constructor(
    private readonly bulletPointsRepo: IBulletPointsRepository,
    private readonly logger: ILoggerService,
  ) {}

  async execute(dto: DeleteBulletPointRequestDto): Promise<DeleteBulletPointResponseDto> {
    this.logger.info('DeleteBulletPoint - started', { userId: dto.userId, id: dto.id });

    const existing = await this.bulletPointsRepo.findById(dto.id);
    if (!existing || existing.user_id !== dto.userId) {
      this.logger.warn('DeleteBulletPoint - not found or not owned', { userId: dto.userId, id: dto.id });
      throw new NotFoundError('Bullet point not found');
    }

    try {
      await this.bulletPointsRepo.delete(dto.id);
    } catch (error) {
      this.logger.error('DeleteBulletPoint - failed to delete', error instanceof Error ? error : undefined, {
        userId: dto.userId,
        id: dto.id,
      });
      throw new InternalError('Failed to delete bullet point - please try again');
    }

    this.logger.info('DeleteBulletPoint - completed', { userId: dto.userId, id: dto.id });

    return DeleteBulletPointResponseDto.toResponse();
  }
}
