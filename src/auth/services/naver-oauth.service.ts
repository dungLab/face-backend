import { OAuthServiceType } from '@/auth/constants';
import { AbstractOAuthService } from '@/auth/services/abstract-oauth-service';
import { JwtPayload } from '@/auth/types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NaverOAuthService extends AbstractOAuthService {
  login(): Promise<JwtPayload> {
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
