export enum SessionImportStrategyType {
  ADAPTER = 'ADAPTER',
  SCRAPING = 'SCRAPING',
  CUSTOM_MAPPING = 'CUSTOM_MAPPING'
}

export interface SessionImportStrategyDto {
  strategy: SessionImportStrategyType;
  displayName: string;
}

export interface ImportSessionsRequest {
  strategyType: SessionImportStrategyType;
  strategyName: string;
  url: string;
  httpMethod: string;
  additionalParams?: { [key: string]: string };
} 