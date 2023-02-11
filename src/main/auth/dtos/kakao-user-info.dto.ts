import { OAuthUserInfoDto } from '@/main/auth/dtos/oauth-user-info.dto';

export class KakaoUserInfoDto extends OAuthUserInfoDto {
  email: string;
}
