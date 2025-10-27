import type { StrategyCallbackRequest } from '@app/oauth2/oauth2.dto';

export interface RequestWithQuery extends StrategyCallbackRequest {
  query: Record<string, unknown>;
}
