import { IOpenRouterExternalService } from '../../../infrastructure/external-services/openrouter/openrouter.external-service.interface';
import { ILoggerService } from '../../../shared/services/logger/logger.service.interface';
import { ValidationError, InternalError } from '../../../shared/core/api-error';
import { AnalyzeTextRequestDto, AnalyzeTextResponseDto } from './dtos/analyze-text.dto';

export class AnalyzeTextUseCase {
  constructor(
    private readonly openRouterService: IOpenRouterExternalService,
    private readonly logger: ILoggerService,
  ) {}

  async execute(dto: AnalyzeTextRequestDto): Promise<AnalyzeTextResponseDto> {
    this.logger.info('AnalyzeText - started');

    if (!dto.text || dto.text.trim().length === 0) {
      throw new ValidationError('Text is required to analyze');
    }

    try {
      const result = await this.openRouterService.correctText({ text: dto.text });

      this.logger.info('AnalyzeText - completed');

      return AnalyzeTextResponseDto.toResponse({
        originalText: dto.text,
        correctedText: result.correctedText,
      });
    } catch (error) {
      // The external service already logs and throws InternalError with a safe
      // message. Re-throwing here (rather than wrapping again) keeps that
      // message intact for the client, while still surfacing a clear failure
      // instead of blocking - the caller always still has the original text
      // and can fall back to a plain "Save" with no AI involvement.
      if (error instanceof InternalError) {
        throw error;
      }
      this.logger.error('AnalyzeText - unexpected failure', error instanceof Error ? error : undefined);
      throw new InternalError('AI analysis failed - please try again');
    }
  }
}
