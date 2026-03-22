export class HttpError extends Error {
  readonly status: number
  constructor(status: number, message: string) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}

const HTTP_ERROR_MESSAGES: Record<string | number, string> = {
  "default": "Failed to load data. Please check your connection and try again.",
  401: "You are not authorised to view this data.",
  403: "You are not authorised to view this data.",
  404: "The requested data could not be found.",
  500: "Server error. Please try again later.",
};

export function getErrorMessage(error: unknown): string {
  if (error instanceof HttpError) {
    if (HTTP_ERROR_MESSAGES[error.status]) return HTTP_ERROR_MESSAGES[error.status];
    if (error.status >= 500) return HTTP_ERROR_MESSAGES[500];
  }
  return HTTP_ERROR_MESSAGES["default"];
}
