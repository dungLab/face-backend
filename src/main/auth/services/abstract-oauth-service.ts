import { OAuthServiceType } from '@/main/auth/constants';
import { OAuthUserInfoDto } from '@/main/auth/dtos/oauth-user-info.dto';

export abstract class AbstractOAuthService {
  abstract login(id?: string, pwd?: string): Promise<OAuthUserInfoDto>;

  abstract logout();

  abstract signUp();

  abstract getIdentificationKey(): OAuthServiceType;
}
