import { IUsersRepository } from '../../../infrastructure/repositories/users/users.repository.interface';
import { IRefreshTokensRepository } from '../../../infrastructure/repositories/refresh-tokens/refresh-tokens.repository.interface';
import { IHashService } from '../../../shared/services/hash/hash.service.interface';
import { IJwtService } from '../../../shared/services/jwt/jwt.service.interface';
import { IIdService } from '../../../shared/services/id/id.service.interface';
import { ILoggerService } from '../../../shared/services/logger/logger.service.interface';
import { UnauthorizedError, InternalError } from '../../../shared/core/api-error';
import { config } from '../../../shared/config';
import { LoginRequestDto, LoginResponseDto } from './dtos/login.dto';
import crypto from 'crypto';

export class LoginUseCase {
  constructor(
    private readonly usersRepo: IUsersRepository,
    private readonly refreshTokensRepo: IRefreshTokensRepository,
    private readonly hashService: IHashService,
    private readonly jwtService: IJwtService,
    private readonly idService: IIdService,
    private readonly logger: ILoggerService,
  ) {}

  async execute(dto: LoginRequestDto): Promise<LoginResponseDto> {
    this.logger.info('Login - started', { username: dto.username });

    const user = await this.usersRepo.findByUsername(dto.username);
    if (!user) {
      this.logger.warn('Login - user not found', { username: dto.username });
      throw new UnauthorizedError('Invalid username or password');
    }

    const passwordMatches = await this.hashService.compare(dto.password, user.passwordHash);
    if (!passwordMatches) {
      this.logger.warn('Login - password mismatch', { username: dto.username });
      throw new UnauthorizedError('Invalid username or password');
    }

    const accessToken = this.jwtService.signAccessToken({ sub: user.id, username: user.username });
    const refreshToken = this.jwtService.signRefreshToken({ sub: user.id, username: user.username });
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const expiresAt = this.jwtService.expiryDateFromNow(config.jwtRefreshExpiresIn);

    try {
      await this.refreshTokensRepo.create({
        id: this.idService.generate(),
        userId: user.id,
        tokenHash,
        expiresAt,
      });
    } catch (error) {
      this.logger.error('Login - failed to store refresh token', error instanceof Error ? error : undefined, {
        userId: user.id,
      });
      throw new InternalError('Login failed - please try again');
    }

    this.logger.info('Login - completed', { userId: user.id });

    return LoginResponseDto.toResponse({
      userId: user.id,
      username: user.username,
      accessToken,
      refreshToken,
    });
  }
}
