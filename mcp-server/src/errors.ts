export interface StructuredError {
  error: string;
  [key: string]: unknown;
}

export function notFound(suggestion: string | null): StructuredError {
  return suggestion ? { error: "not_found", suggestion } : { error: "not_found" };
}

export function unknownProduct(available: string[]): StructuredError {
  return { error: "unknown_product", available };
}
