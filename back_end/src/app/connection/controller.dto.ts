import {ServiceProviderData} from "@app/auth/services";
import {JwtPayload} from "@app/auth/jwt/jwt.dto";

export interface StrategyCallbackRequest extends Request {
  provider: ServiceProviderData;
  user: JwtPayload;
}