import { PartialType } from '@nestjs/mapped-types';
import { BodyAuthDto } from './body-auth.dto';

export class UpdateAuthDto extends PartialType(BodyAuthDto) {}
