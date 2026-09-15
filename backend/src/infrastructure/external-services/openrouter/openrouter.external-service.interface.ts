import { CorrectTextParams, CorrectTextResult } from './openrouter.types';

export interface IOpenRouterExternalService {
  correctText(params: CorrectTextParams): Promise<CorrectTextResult>;
}
