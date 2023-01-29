import { AuthServiceType } from '@/auth/constants';
import { LoginResponseDto } from '@/auth/dtos/response/login-response.dto';

export abstract class AbstractAuthService {
  abstract login(id?: string, pwd?: string): Promise<LoginResponseDto>;

  abstract logout();

  abstract signUp();

  abstract getIdentificationKey(): AuthServiceType;
}
