import { OAuthServiceType } from '@/auth/constants';
import { OAuthUserInfoDto } from '@/auth/dtos/oauth-user-info.dto';

export abstract class AbstractOAuthService {
  abstract login(id?: string, pwd?: string): Promise<OAuthUserInfoDto>;

  abstract logout();

  abstract signUp();

  abstract getIdentificationKey(): OAuthServiceType;
}
