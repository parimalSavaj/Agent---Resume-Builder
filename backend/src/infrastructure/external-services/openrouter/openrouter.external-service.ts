import { IOpenRouterExternalService } from './openrouter.external-service.interface';
import { CorrectTextParams, CorrectTextResult } from './openrouter.types';
import { ILoggerService } from '../../../shared/services/logger/logger.service.interface';
import { InternalError } from '../../../shared/core/api-error';
import { config } from '../../../shared/config';

const OPENROUTER_CHAT_COMPLETIONS_URL = 'https://openrouter.ai/api/v1/chat/completions';
const REQUEST_TIMEOUT_MS = 20000;

const SYSTEM_PROMPT =
  'You correct typos, spelling, and grammar in resume content, and smooth out awkward phrasing. ' +
  'You must NEVER change facts, dates, numbers, metrics, tags, or the names of companies, projects, ' +
  'schools, or skills. Only fix wording, spelling, and grammar. ' +
  'Respond with ONLY the corrected text - no explanation, no quotes, no markdown formatting.';

export class OpenRouterExternalService implements IOpenRouterExternalService {
  constructor(private readonly logger: ILoggerService) {}

  async correctText(params: CorrectTextParams): Promise<CorrectTextResult> {
    this.logger.info('OpenRouter - correctText started', { model: config.openRouterModel });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(OPENROUTER_CHAT_COMPLETIONS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.openRouterApiKey}`,
        },
        body: JSON.stringify({
          model: config.openRouterModel,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: params.text },
          ],
          temperature: 0.2,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const body = await response.text();
        this.logger.error('OpenRouter - request failed', undefined, {
          status: response.status,
          body: body.slice(0, 500),
        });
        throw new InternalError('AI correction request failed');
      }

      const data = (await response.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const correctedText = data.choices?.[0]?.message?.content?.trim();

      if (!correctedText) {
        this.logger.error('OpenRouter - empty response', undefined, { model: config.openRouterModel });
        throw new InternalError('AI correction returned no result');
      }

      this.logger.info('OpenRouter - correctText completed');
      return { correctedText };
    } catch (error) {
      if (error instanceof InternalError) {
        throw error;
      }
      const isTimeout = error instanceof Error && error.name === 'AbortError';
      this.logger.error(
        isTimeout ? 'OpenRouter - request timed out' : 'OpenRouter - request threw unexpectedly',
        error instanceof Error ? error : undefined,
      );
      throw new InternalError(isTimeout ? 'AI correction timed out' : 'AI correction failed');
    } finally {
      clearTimeout(timeout);
    }
  }
}
