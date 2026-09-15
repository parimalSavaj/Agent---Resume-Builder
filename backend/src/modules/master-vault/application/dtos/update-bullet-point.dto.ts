import { Request } from 'express';

export class UpdateBulletPointRequestDto {
  readonly id: string;
  readonly userId: string;
  readonly text: string;
  readonly tags: string[];
  readonly metric: string | null;

  private constructor(props: { id: string; userId: string; text: string; tags: string[]; metric: string | null }) {
    this.id = props.id;
    this.userId = props.userId;
    this.text = props.text;
    this.tags = props.tags;
    this.metric = props.metric;
  }

  static fromRequest(req: Request): UpdateBulletPointRequestDto {
    return new UpdateBulletPointRequestDto({
      id: req.params.id as string,
      userId: req.user!.sub,
      text: req.body.text,
      tags: req.body.tags ?? [],
      metric: req.body.metric ?? null,
    });
  }
}

export class UpdateBulletPointResponseDto {
  readonly id: string;
  readonly parentType: string;
  readonly parentId: string;
  readonly text: string;
  readonly tags: string[];
  readonly metric: string | null;
  readonly isUntagged: boolean;

  private constructor(props: {
    id: string;
    parentType: string;
    parentId: string;
    text: string;
    tags: string[];
    metric: string | null;
  }) {
    this.id = props.id;
    this.parentType = props.parentType;
    this.parentId = props.parentId;
    this.text = props.text;
    this.tags = props.tags;
    this.metric = props.metric;
    this.isUntagged = props.tags.length === 0;
  }

  static toResponse(row: {
    id: string;
    parent_type: string;
    parent_id: string;
    text: string;
    tags: string[];
    metric: string | null;
  }): UpdateBulletPointResponseDto {
    return new UpdateBulletPointResponseDto({
      id: row.id,
      parentType: row.parent_type,
      parentId: row.parent_id,
      text: row.text,
      tags: row.tags,
      metric: row.metric,
    });
  }
}
