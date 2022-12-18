export type ChangeSecurityLevelParams = {
  value: 'off' | 'essentially_off' | 'low' | 'medium' | 'high' | 'under_attack';
};

export type CreateWorkerRouteParams = {
  pattern: string;
  script: string;
};

export type DeleteWorkerRouteParams = {
  id: string;
};

export type BaseResBody = {
  success: boolean;
  errors: {
    code: number;
    message: string;
  }[];
  messages: unknown[];
  result_info?: {
    page: number;
    per_page: number;
    count: number;
    total_count: number;
  };
};

export type GetSecurityLevelResBody = BaseResBody & {
  result: {
    id: string;
    value: string;
    editable: boolean;
    modified_on: string;
  };
};

export type ChangeSecurityLevelResBody = GetSecurityLevelResBody;

export type CreateWorkerRouteResBody = BaseResBody & {
  result: {
    id: string;
  };
};

export type DeleteWorkerRouteResBody = CreateWorkerRouteResBody;
