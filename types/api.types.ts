export interface PriceTargetResponse {
  high: number;
  low: number;
  mean: number;
  last_close: number;
  symbol: string;
  name: string;
  logo_url: string | null;
}

export interface ApiError {
  message?: string;
  status: number;
}
