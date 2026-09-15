import { IUsersRepository } from '../../../infrastructure/repositories/users/users.repository.interface';
import { IRefreshTokensRepository } from '../../../infrastructure/repositories/refresh-tokens/refresh-tokens.repository.interface';
import { IHashService } from '../../../shared/services/hash/hash.service.interface';
import { IJwtService } from '../../../shared/services/jwt/jwt.service.interface';
import { IIdService } from '../../../shared/services/id/id.service.interface';
import { ILoggerService } from '../../../shared/services/logger/logger.service.interface';
import { ConflictError, InternalError } from '../../../shared/core/api-error';
import { UserEntity } from '../../../domain/entities/user.entity';
import { config } from '../../../shared/config';
import { SignupRequestDto, SignupResponseDto } from './dtos/signup.dto';

export class SignupUseCase {
  constructor(
    private readonly usersRepo: IUsersRepository,
    private readonly refreshTokensRepo: IRefreshTokensRepository,
    private readonly hashService: IHashService,
    private readonly jwtService: IJwtService,
    private readonly idService: IIdService,
    private readonly logger: ILoggerService,
  ) {}

  async execute(dto: SignupRequestDto): Promise<SignupResponseDto> {
    this.logger.info('Signup - started', { username: dto.username });

    const existing = await this.usersRepo.findByUsername(dto.username);
    if (existing) {
      this.logger.warn('Signup - username already taken', { username: dto.username });
      throw new ConflictError('Username is already taken');
    }

    const passwordHash = await this.hashService.hash(dto.password);
    const user = UserEntity.create({
      id: this.idService.generate(),
      username: dto.username,
      passwordHash,
    });

    try {
      await this.usersRepo.create(user);
    } catch (error) {
      this.logger.error('Signup - failed to create user', error instanceof Error ? error : undefined, {
        username: dto.username,
      });
      throw new InternalError('Failed to create account - please try again');
    }

    const accessToken = this.jwtService.signAccessToken({ sub: user.id, username: user.username });
    const refreshToken = this.jwtService.signRefreshToken({ sub: user.id, username: user.username });
    const tokenHash = require('crypto').createHash('sha256').update(refreshToken).digest('hex');
    const expiresAt = this.jwtService.expiryDateFromNow(config.jwtRefreshExpiresIn);

    try {
      await this.refreshTokensRepo.create({
        id: this.idService.generate(),
        userId: user.id,
        tokenHash,
        expiresAt,
      });
    } catch (error) {
      this.logger.error('Signup - failed to store refresh token', error instanceof Error ? error : undefined, {
        userId: user.id,
      });
      throw new InternalError('Failed to create account - please try again');
    }

    this.logger.info('Signup - completed', { userId: user.id });

    return SignupResponseDto.toResponse({
      userId: user.id,
      username: user.username,
      accessToken,
      refreshToken,
    });
  }
}
