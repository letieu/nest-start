import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VehicleTypesModule } from './collection/vehicle_types/vehicle_types.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './collection/user/user.module';
import { EmailModule } from './collection/email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    VehicleTypesModule,
    AuthModule,
    UserModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
