import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class EvaluationRequestDto {
  @IsBoolean()
  @ApiProperty({
    description: '좋아요 여부',
  })
  isGood: boolean;
}
