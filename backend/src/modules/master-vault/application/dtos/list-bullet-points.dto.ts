import { Request } from 'express';
import { BulletPointResponseDto } from './create-bullet-point.dto';

export class ListBulletPointsRequestDto {
  readonly userId: string;
  readonly tag: string | null;
  readonly parentType: string | null;
  readonly parentId: string | null;
  readonly dateFrom: string | null;
  readonly dateTo: string | null;

  private constructor(props: {
    userId: string;
    tag: string | null;
    parentType: string | null;
    parentId: string | null;
    dateFrom: string | null;
    dateTo: string | null;
  }) {
    this.userId = props.userId;
    this.tag = props.tag;
    this.parentType = props.parentType;
    this.parentId = props.parentId;
    this.dateFrom = props.dateFrom;
    this.dateTo = props.dateTo;
  }

  static fromRequest(req: Request): ListBulletPointsRequestDto {
    return new ListBulletPointsRequestDto({
      userId: req.user!.sub,
      tag: typeof req.query.tag === 'string' ? req.query.tag : null,
      parentType: typeof req.query.parentType === 'string' ? req.query.parentType : null,
      parentId: typeof req.query.parentId === 'string' ? req.query.parentId : null,
      dateFrom: typeof req.query.dateFrom === 'string' ? req.query.dateFrom : null,
      dateTo: typeof req.query.dateTo === 'string' ? req.query.dateTo : null,
    });
  }
}

export class ListBulletPointsResponseDto {
  readonly items: BulletPointResponseDto[];

  private constructor(props: { items: BulletPointResponseDto[] }) {
    this.items = props.items;
  }

  static toResponse(rows: {
    id: string;
    parent_type: string;
    parent_id: string;
    text: string;
    tags: string[];
    metric: string | null;
  }[]): ListBulletPointsResponseDto {
    return new ListBulletPointsResponseDto({
      items: rows.map((row) => BulletPointResponseDto.toResponse(row)),
    });
  }
}
