import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { MongooseModule } from '@nestjs/mongoose';
// import * as CacheModule from '@nestjs/cache-manager';
@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017'),
    UserModule,
    AuthModule,
    VehicleModule,
    // CacheModule.CacheModule.register(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
