import { OAuthServiceType } from '@/main/auth/constants';
import { NaverUserInfoDto } from '@/main/auth/dtos/naver-user-info.dto';
import { AbstractOAuthService } from '@/main/auth/services/abstract-oauth-service';
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
