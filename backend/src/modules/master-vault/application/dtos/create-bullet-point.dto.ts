import { Request } from 'express';

export class CreateBulletPointRequestDto {
  readonly userId: string;
  readonly parentType: string;
  readonly parentId: string;
  readonly text: string;
  readonly tags: string[];
  readonly metric: string | null;

  private constructor(props: {
    userId: string;
    parentType: string;
    parentId: string;
    text: string;
    tags: string[];
    metric: string | null;
  }) {
    this.userId = props.userId;
    this.parentType = props.parentType;
    this.parentId = props.parentId;
    this.text = props.text;
    this.tags = props.tags;
    this.metric = props.metric;
  }

  static fromRequest(req: Request): CreateBulletPointRequestDto {
    return new CreateBulletPointRequestDto({
      userId: req.user!.sub,
      parentType: req.body.parentType,
      parentId: req.body.parentId,
      text: req.body.text,
      tags: req.body.tags ?? [],
      metric: req.body.metric ?? null,
    });
  }
}

export class BulletPointResponseDto {
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
  }): BulletPointResponseDto {
    return new BulletPointResponseDto({
      id: row.id,
      parentType: row.parent_type,
      parentId: row.parent_id,
      text: row.text,
      tags: row.tags,
      metric: row.metric,
    });
  }
}
