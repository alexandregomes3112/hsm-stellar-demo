import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HsmModule } from './hsm/hsm.module';
import { StellarModule } from './stellar/stellar.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
  isGlobal: true,
  ignoreEnvFile: true, // usa apenas as variáveis do ambiente do container
  }),
    PrismaModule,
    HsmModule,
    StellarModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
