import { Module } from '@nestjs/common';
import { HeaderController } from './header.controller';
import { HeaderService } from './header.service';
import { HeaderRepository } from './header.repository';

@Module({
  controllers: [HeaderController],
  providers: [HeaderService, HeaderRepository],
})
export class HeaderModule {}
