import { OAuthServiceType } from '@/auth/constants';
import { LoginResponseDto } from '@/auth/dtos/response/login-response.dto';
import { AbstractOAuthService } from '@/auth/services/abstract-oauth-service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NaverOAuthService extends AbstractOAuthService {
  login(): Promise<LoginResponseDto> {
    throw new Error('Method not implemented.');
  }

  logout() {
    throw new Error('Method not implemented.');
  }

  signUp() {
    throw new Error('Method not implemented.');
  }

  getIdentificationKey(): OAuthServiceType {
    return OAuthServiceType.NAVER;
  }
}
