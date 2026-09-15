import { IUsersRepository } from '../../../infrastructure/repositories/users/users.repository.interface';
import { IRefreshTokensRepository } from '../../../infrastructure/repositories/refresh-tokens/refresh-tokens.repository.interface';
import { IJwtService } from '../../../shared/services/jwt/jwt.service.interface';
import { IIdService } from '../../../shared/services/id/id.service.interface';
import { ILoggerService } from '../../../shared/services/logger/logger.service.interface';
import { UnauthorizedError, InternalError } from '../../../shared/core/api-error';
import { config } from '../../../shared/config';
import { RefreshRequestDto, RefreshResponseDto } from './dtos/refresh.dto';
import crypto from 'crypto';

export class RefreshUseCase {
  constructor(
    private readonly usersRepo: IUsersRepository,
    private readonly refreshTokensRepo: IRefreshTokensRepository,
    private readonly jwtService: IJwtService,
    private readonly idService: IIdService,
    private readonly logger: ILoggerService,
  ) {}

  async execute(dto: RefreshRequestDto): Promise<RefreshResponseDto> {
    this.logger.info('Refresh - started');

    let payload;
    try {
      payload = this.jwtService.verifyRefreshToken(dto.refreshToken);
    } catch {
      this.logger.warn('Refresh - invalid token signature');
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    const tokenHash = crypto.createHash('sha256').update(dto.refreshToken).digest('hex');
    const stored = await this.refreshTokensRepo.findValid(payload.sub, tokenHash);
    if (!stored) {
      this.logger.warn('Refresh - token not found or revoked', { userId: payload.sub });
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    const user = await this.usersRepo.findById(payload.sub);
    if (!user) {
      this.logger.warn('Refresh - user not found', { userId: payload.sub });
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    // Rotate: revoke old token, issue new pair
    try {
      await this.refreshTokensRepo.revoke(payload.sub, tokenHash);
    } catch (error) {
      this.logger.error('Refresh - failed to revoke old token', error instanceof Error ? error : undefined, {
        userId: user.id,
      });
      throw new InternalError('Token refresh failed - please try again');
    }

    const accessToken = this.jwtService.signAccessToken({ sub: user.id, username: user.username });
    const newRefreshToken = this.jwtService.signRefreshToken({ sub: user.id, username: user.username });
    const newTokenHash = crypto.createHash('sha256').update(newRefreshToken).digest('hex');
    const expiresAt = this.jwtService.expiryDateFromNow(config.jwtRefreshExpiresIn);

    try {
      await this.refreshTokensRepo.create({
        id: this.idService.generate(),
        userId: user.id,
        tokenHash: newTokenHash,
        expiresAt,
      });
    } catch (error) {
      this.logger.error('Refresh - failed to store new token', error instanceof Error ? error : undefined, {
        userId: user.id,
      });
      throw new InternalError('Token refresh failed - please try again');
    }

    this.logger.info('Refresh - completed', { userId: user.id });

    return RefreshResponseDto.toResponse({
      userId: user.id,
      username: user.username,
      accessToken,
      refreshToken: newRefreshToken,
    });
  }
}
