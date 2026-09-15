import { ISkillsRepository } from '../../../infrastructure/repositories/skills/skills.repository.interface';
import { ILoggerService } from '../../../shared/services/logger/logger.service.interface';
import { NotFoundError, InternalError } from '../../../shared/core/api-error';
import { UpdateSkillRequestDto, UpdateSkillResponseDto } from './dtos/update-skill.dto';

export class UpdateSkillUseCase {
  constructor(
    private readonly skillsRepo: ISkillsRepository,
    private readonly logger: ILoggerService,
  ) {}

  async execute(dto: UpdateSkillRequestDto): Promise<UpdateSkillResponseDto> {
    this.logger.info('UpdateSkill - started', { userId: dto.userId, id: dto.id });

    const existing = await this.skillsRepo.findById(dto.id);
    if (!existing || existing.user_id !== dto.userId) {
      this.logger.warn('UpdateSkill - not found or not owned', { userId: dto.userId, id: dto.id });
      throw new NotFoundError('Skill not found');
    }

    const updatedAt = new Date();

    try {
      await this.skillsRepo.update(dto.id, { name: dto.name, category: dto.category, updatedAt });
    } catch (error) {
      this.logger.error('UpdateSkill - failed to update', error instanceof Error ? error : undefined, {
        userId: dto.userId,
        id: dto.id,
      });
      throw new InternalError('Failed to update skill - please try again');
    }

    this.logger.info('UpdateSkill - completed', { userId: dto.userId, id: dto.id });

    return UpdateSkillResponseDto.toResponse({ id: dto.id, name: dto.name, category: dto.category });
  }
}
