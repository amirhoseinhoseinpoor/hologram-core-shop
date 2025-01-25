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
import { GateWaysModule } from './modules/gateways/gateways.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { RolesPermissionModule } from './modules/roles-permission/roles-permission.module';
import { PermissionModule } from './modules/permission/permission.module';

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
      database: process.env.APP_MODE === 'prod' ? process.env.DB_NAME : process.env.DB_DEV_NAME,
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
    GateWaysModule,
    AnalyticsModule,
    RolesPermissionModule,
    PermissionModule,
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
