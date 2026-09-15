export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = this.constructor.name;
  }

  toJSON() {
    return {
      statusCode: this.statusCode,
      error: this.message,
    };
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Not found') {
    super(404, message);
  }
}

export class ValidationError extends ApiError {
  constructor(message = 'Validation failed') {
    super(400, message);
  }
}

export class ConflictError extends ApiError {
  constructor(message = 'Conflict') {
    super(409, message);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized') {
    super(401, message);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = 'Forbidden') {
    super(403, message);
  }
}

export class InternalError extends ApiError {
  constructor(message = 'Internal server error') {
    super(500, message);
  }
}
