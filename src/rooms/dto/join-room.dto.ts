import { IsString, Length, Matches } from 'class-validator';

export class JoinRoomDto {
  @IsString()
  @Length(6, 6, { message: 'Code must be 6 characters long' })
  @Matches(/^[A-Z0-9]+$/, {
    message: 'Code must contain only letters and numbers',
  })
  code: string;
}
