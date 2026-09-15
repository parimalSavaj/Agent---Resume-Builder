import { IRefreshTokensRepository } from '../../../infrastructure/repositories/refresh-tokens/refresh-tokens.repository.interface';
import { ILoggerService } from '../../../shared/services/logger/logger.service.interface';
import { InternalError } from '../../../shared/core/api-error';
import { LogoutRequestDto, LogoutResponseDto } from './dtos/logout.dto';
import crypto from 'crypto';

export class LogoutUseCase {
  constructor(
    private readonly refreshTokensRepo: IRefreshTokensRepository,
    private readonly logger: ILoggerService,
  ) {}

  async execute(dto: LogoutRequestDto): Promise<LogoutResponseDto> {
    this.logger.info('Logout - started', { userId: dto.userId });

    try {
      if (dto.refreshToken) {
        const tokenHash = crypto.createHash('sha256').update(dto.refreshToken).digest('hex');
        await this.refreshTokensRepo.revoke(dto.userId, tokenHash);
      } else {
        await this.refreshTokensRepo.revokeAllForUser(dto.userId);
      }
    } catch (error) {
      this.logger.error('Logout - failed to revoke token(s)', error instanceof Error ? error : undefined, {
        userId: dto.userId,
      });
      throw new InternalError('Logout failed - please try again');
    }

    this.logger.info('Logout - completed', { userId: dto.userId });

    return LogoutResponseDto.toResponse();
  }
}
