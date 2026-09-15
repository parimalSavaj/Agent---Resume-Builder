import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS } from '../../../shared/constants/status-code.constants';
import { ApiResponse } from '../../../shared/core/api-response';
import { SignupUseCase } from '../application/signup.use-case';
import { LoginUseCase } from '../application/login.use-case';
import { RefreshUseCase } from '../application/refresh.use-case';
import { LogoutUseCase } from '../application/logout.use-case';
import { SignupRequestDto } from '../application/dtos/signup.dto';
import { LoginRequestDto } from '../application/dtos/login.dto';
import { RefreshRequestDto } from '../application/dtos/refresh.dto';
import { LogoutRequestDto } from '../application/dtos/logout.dto';
import { MeRequestDto, MeResponseDto } from '../application/dtos/me.dto';

export class AuthController {
  constructor(
    private readonly signupUseCase: SignupUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshUseCase: RefreshUseCase,
    private readonly logoutUseCase: LogoutUseCase,
  ) {}

  signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = SignupRequestDto.fromRequest(req);
      const result = await this.signupUseCase.execute(dto);
      res.status(HTTP_STATUS.CREATED).json(new ApiResponse(HTTP_STATUS.CREATED, result));
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = LoginRequestDto.fromRequest(req);
      const result = await this.loginUseCase.execute(dto);
      res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, result));
    } catch (error) {
      next(error);
    }
  };

  refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = RefreshRequestDto.fromRequest(req);
      const result = await this.refreshUseCase.execute(dto);
      res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, result));
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = LogoutRequestDto.fromRequest(req);
      await this.logoutUseCase.execute(dto);
      res.status(HTTP_STATUS.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  };

  me = (req: Request, res: Response): void => {
    const dto = MeRequestDto.fromRequest(req);
    const result = MeResponseDto.toResponse({ userId: dto.userId, username: dto.username });
    res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, result));
  };
}
