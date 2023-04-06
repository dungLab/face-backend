import { OAuthUserInfoDto } from '@/auth/dtos/oauth-user-info.dto';

export class KakaoUserInfoDto extends OAuthUserInfoDto {
  email: string;
}
