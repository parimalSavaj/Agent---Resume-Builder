import { IDatabaseService } from '../../shared/services/database/database.service.interface';
import { ILoggerService } from '../../shared/services/logger/logger.service.interface';
import { IJwtService } from '../../shared/services/jwt/jwt.service.interface';
import { UsersRepository } from '../../infrastructure/repositories/users/users.repository';
import { RefreshTokensRepository } from '../../infrastructure/repositories/refresh-tokens/refresh-tokens.repository';
import { HashService } from '../../shared/services/hash/hash.service';
import { IdService } from '../../shared/services/id/id.service';
import { SignupUseCase } from './application/signup.use-case';
import { LoginUseCase } from './application/login.use-case';
import { RefreshUseCase } from './application/refresh.use-case';
import { LogoutUseCase } from './application/logout.use-case';
import { AuthController } from './presentation/auth.controller';

export class AuthFactory {
  static create(db: IDatabaseService, logger: ILoggerService, jwt: IJwtService): AuthController {
    // Repositories
    const usersRepo = new UsersRepository(db);
    const refreshTokensRepo = new RefreshTokensRepository(db);

    // Shared services (singletons already initialised in server.ts)
    const hashService = HashService.getInstance();
    const idService = IdService.getInstance();

    // Use cases
    const signupUseCase = new SignupUseCase(usersRepo, refreshTokensRepo, hashService, jwt, idService, logger);
    const loginUseCase = new LoginUseCase(usersRepo, refreshTokensRepo, hashService, jwt, idService, logger);
    const refreshUseCase = new RefreshUseCase(usersRepo, refreshTokensRepo, jwt, idService, logger);
    const logoutUseCase = new LogoutUseCase(refreshTokensRepo, logger);

    return new AuthController(signupUseCase, loginUseCase, refreshUseCase, logoutUseCase);
  }
}
