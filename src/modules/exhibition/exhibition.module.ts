import { Module } from '@nestjs/common';
import { ExhibitionController } from './exhibition.controller';
import { ExhibitionService } from './exhibition.service';
import { ExhibitionRepository } from './exhibition.repository';
import { SystemModule } from '../system/system.module';

@Module({
  imports: [
    SystemModule,
  ],
  controllers: [ExhibitionController],
  providers: [ExhibitionService, ExhibitionRepository],
})
export class ExhibitionModule {}
