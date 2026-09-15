import { ISkillsRepository } from '../../../infrastructure/repositories/skills/skills.repository.interface';
import { ILoggerService } from '../../../shared/services/logger/logger.service.interface';
import { ListSkillsRequestDto, ListSkillsResponseDto } from './dtos/list-skills.dto';

export class ListSkillsUseCase {
  constructor(
    private readonly skillsRepo: ISkillsRepository,
    private readonly logger: ILoggerService,
  ) {}

  async execute(dto: ListSkillsRequestDto): Promise<ListSkillsResponseDto> {
    this.logger.info('ListSkills - started', { userId: dto.userId });

    const rows = await this.skillsRepo.findAllByUserId(dto.userId);

    return ListSkillsResponseDto.toResponse(rows);
  }
}
