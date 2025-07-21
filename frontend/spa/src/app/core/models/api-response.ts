/**
 * Modelos para las respuestas del API
 */

export interface ApiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      count: number;
      next?: string;
      previous?: string;
    };
  };
  message?: string;
}

export interface ApiPaginationResponse<T> extends ApiResponse<T[]> {
  meta: {
    pagination: {
      count: number;
      next?: string;
      previous?: string;
    };
  };
}
