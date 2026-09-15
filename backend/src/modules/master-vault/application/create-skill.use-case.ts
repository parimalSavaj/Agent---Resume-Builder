import { ISkillsRepository } from '../../../infrastructure/repositories/skills/skills.repository.interface';
import { IIdService } from '../../../shared/services/id/id.service.interface';
import { ILoggerService } from '../../../shared/services/logger/logger.service.interface';
import { InternalError } from '../../../shared/core/api-error';
import { CreateSkillRequestDto, SkillResponseDto } from './dtos/create-skill.dto';

export class CreateSkillUseCase {
  constructor(
    private readonly skillsRepo: ISkillsRepository,
    private readonly idService: IIdService,
    private readonly logger: ILoggerService,
  ) {}

  async execute(dto: CreateSkillRequestDto): Promise<SkillResponseDto> {
    this.logger.info('CreateSkill - started', { userId: dto.userId });

    const id = this.idService.generate();
    const now = new Date();

    try {
      await this.skillsRepo.create({
        id,
        userId: dto.userId,
        name: dto.name,
        category: dto.category,
        createdAt: now,
        updatedAt: now,
      });
    } catch (error) {
      this.logger.error('CreateSkill - failed to create', error instanceof Error ? error : undefined, {
        userId: dto.userId,
      });
      throw new InternalError('Failed to save skill - please try again');
    }

    this.logger.info('CreateSkill - completed', { userId: dto.userId, id });

    return SkillResponseDto.toResponse({ id, name: dto.name, category: dto.category });
  }
}
