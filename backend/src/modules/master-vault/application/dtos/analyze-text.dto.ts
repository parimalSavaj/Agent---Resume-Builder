import { Request } from 'express';

export class AnalyzeTextRequestDto {
  readonly text: string;

  private constructor(props: { text: string }) {
    this.text = props.text;
  }

  static fromRequest(req: Request): AnalyzeTextRequestDto {
    return new AnalyzeTextRequestDto({ text: req.body.text });
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
