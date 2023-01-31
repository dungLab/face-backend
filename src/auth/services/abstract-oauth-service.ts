import { OAuthServiceType } from '@/auth/constants';
import { JwtPayload } from '@/auth/types';

export abstract class AbstractOAuthService {
  abstract login(id?: string, pwd?: string): Promise<JwtPayload>;

  abstract logout();

  abstract signUp();

  abstract getIdentificationKey(): OAuthServiceType;
}
