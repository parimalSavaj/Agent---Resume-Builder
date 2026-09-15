import { ISkillsRepository } from '../../../infrastructure/repositories/skills/skills.repository.interface';
import { ILoggerService } from '../../../shared/services/logger/logger.service.interface';
import { NotFoundError, InternalError } from '../../../shared/core/api-error';
import { DeleteSkillRequestDto, DeleteSkillResponseDto } from './dtos/delete-skill.dto';

export class DeleteSkillUseCase {
  constructor(
    private readonly skillsRepo: ISkillsRepository,
    private readonly logger: ILoggerService,
  ) {}

  async execute(dto: DeleteSkillRequestDto): Promise<DeleteSkillResponseDto> {
    this.logger.info('DeleteSkill - started', { userId: dto.userId, id: dto.id });

    const existing = await this.skillsRepo.findById(dto.id);
    if (!existing || existing.user_id !== dto.userId) {
      this.logger.warn('DeleteSkill - not found or not owned', { userId: dto.userId, id: dto.id });
      throw new NotFoundError('Skill not found');
    }

    try {
      await this.skillsRepo.delete(dto.id);
    } catch (error) {
      this.logger.error('DeleteSkill - failed to delete', error instanceof Error ? error : undefined, {
        userId: dto.userId,
        id: dto.id,
      });
      throw new InternalError('Failed to delete skill - please try again');
    }

    this.logger.info('DeleteSkill - completed', { userId: dto.userId, id: dto.id });

    return DeleteSkillResponseDto.toResponse();
  }
}
