import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { AuthGuard } from './modules/auth/auth.guard';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { UserRolesModule } from './modules/user-roles/user-roles.module';
import { OrderModule } from './modules/order/order.module';
import { SystemModule } from './modules/system/system.module';
import { ProductModule } from './modules/product/product.module';
import { VideoModule } from './modules/video/video.module';
import { HonorsModule } from './modules/honors/honors.module';
import { ExhibitionModule } from './modules/exhibition/exhibition.module';
import { BlogsModule } from './modules/blogs/blogs.module';
import { BannerModule } from './modules/banner/banner.module';
import { HeaderModule } from './modules/header/header.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    RolesModule,
    UserRolesModule,
    SystemModule,
    OrderModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      password: process.env.DB_PASSWORD,
      username: process.env.DB_USER,
      database: process.env.DB_NAME,
      synchronize: /true/i.test(process.env.DB_SYNC),
      logging: /true/i.test(process.env.DB_LOGGING),
      dropSchema: /true/i.test(process.env.DB_DROP_SCHEMA),
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
    }),
    ProductModule,
    VideoModule,
    HonorsModule,
    ExhibitionModule,
    BlogsModule,
    BannerModule,
    HeaderModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    AppService,
  ],
})
export class AppModule {}
