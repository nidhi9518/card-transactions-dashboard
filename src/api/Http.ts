import { HttpError } from "./HttpError";
export { HttpError } from "./HttpError";
export { getErrorMessage } from "./HttpError";

export interface IHttpClient {
  get<T>(url: string): Promise<T>;
}

export class Http implements IHttpClient {
  private baseUrl: string;
  private headers: HeadersInit;

  constructor(baseUrl: string, headers: HeadersInit = {}) {
    this.baseUrl = baseUrl;
    this.headers = {
      "Content-Type": "application/json",
      ...headers,
    };
  }

  private async request<T>(url: string, options: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}/${url}`, options);
    if (!response.ok) {
      const message = await response.text();
      throw new HttpError(response.status, message || response.statusText);
    }
    return response.json();
  }

  public get<T>(url: string): Promise<T> {
    return this.request<T>(url, {
      method: "GET",
      headers: this.headers,
    });
  }
}