import { OAuthServiceType } from '@/auth/constants';
import { LoginResponseDto } from '@/auth/dtos/response/login-response.dto';

export abstract class AbstractOAuthService {
  abstract login(id?: string, pwd?: string): Promise<LoginResponseDto>;

  abstract logout();

  abstract signUp();

  abstract getIdentificationKey(): OAuthServiceType;
}
