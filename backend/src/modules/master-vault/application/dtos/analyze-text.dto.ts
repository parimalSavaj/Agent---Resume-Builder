import { Request } from 'express';
import { AnalyzeEntryType } from '../prompts/analyze-prompt.builder';

export class AnalyzeTextRequestDto {
  readonly text: string;
  readonly entryType: AnalyzeEntryType;
  readonly contextTitle: string;
  readonly contextCompany: string | null;

  private constructor(props: {
    text: string;
    entryType: AnalyzeEntryType;
    contextTitle: string;
    contextCompany: string | null;
  }) {
    this.text = props.text;
    this.entryType = props.entryType;
    this.contextTitle = props.contextTitle;
    this.contextCompany = props.contextCompany;
  }

  static fromRequest(req: Request): AnalyzeTextRequestDto {
    return new AnalyzeTextRequestDto({
      text: req.body.text,
      entryType: req.body.entryType,
      contextTitle: req.body.context?.title ?? '',
      contextCompany: req.body.context?.company ?? null,
    });
  }
}

export class AnalyzeTextResponseDto {
  readonly originalText: string;
  readonly correctedText: string;

  private constructor(props: { originalText: string; correctedText: string }) {
    this.originalText = props.originalText;
    this.correctedText = props.correctedText;
  }

  static toResponse(data: { originalText: string; correctedText: string }): AnalyzeTextResponseDto {
    return new AnalyzeTextResponseDto(data);
  }
}
