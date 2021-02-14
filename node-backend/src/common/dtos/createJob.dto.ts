import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Matches } from 'class-validator';
import { IsGreaterThan } from './validators/isGreaterThan';
import { MaximumDifference } from './validators/maximumDifference';

export class CreateJobDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/, {
    message: 'Invalid youtube url',
  })
  @Expose()
  public youtubeUrl: string;

  @IsNotEmpty()
  @IsNumber()
  @Expose()
  public startTime: number;

  @IsNotEmpty()
  @IsNumber()
  @IsGreaterThan('startTime', {
    message: 'end time must be greater than start time',
  })
  @MaximumDifference('startTime', 30, {
    message: 'maximum gif duration is 30 seconds',
  })
  @Expose()
  public endTime: number;
}
