import { AuthServiceType } from '@/auth/constants';
import { LoginResponseDto } from '@/auth/dtos/response/login-response.dto';
import { AbstractAuthService } from '@/auth/services/abstract-auth-service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NaverAuthService extends AbstractAuthService {
  login(): Promise<LoginResponseDto> {
    throw new Error('Method not implemented.');
  }

  logout() {
    throw new Error('Method not implemented.');
  }

  signUp() {
    throw new Error('Method not implemented.');
  }

  getIdentificationKey(): AuthServiceType {
    return AuthServiceType.NAVER;
  }
}
