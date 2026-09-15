import crypto from 'crypto';
import { IIdService } from './id.service.interface';

export class IdService implements IIdService {
  private static instance: IdService;

  private constructor() {}

  static getInstance(): IdService {
    if (!IdService.instance) {
      IdService.instance = new IdService();
    }
    return IdService.instance;
  }

  generate(): string {
    return crypto.randomUUID();
  }
}
