export class ApiResponse<T = unknown> {
  public readonly statusCode: number;
  public readonly data: T;

  constructor(statusCode: number, data: T) {
    this.statusCode = statusCode;
    this.data = data;
  }
}
