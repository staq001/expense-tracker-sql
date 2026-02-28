export class handleError extends Error {
  status_code: number | undefined;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.status_code = statusCode;
  }
}
