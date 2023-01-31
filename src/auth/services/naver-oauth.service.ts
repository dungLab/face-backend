import { OAuthServiceType } from '@/auth/constants';
import { NaverUserInfoDto } from '@/auth/dtos/naver-user-info.dto';
import { AbstractOAuthService } from '@/auth/services/abstract-oauth-service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NaverOAuthService extends AbstractOAuthService {
  login(): Promise<NaverUserInfoDto> {
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
