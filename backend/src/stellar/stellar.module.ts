import { Module, forwardRef } from '@nestjs/common';
import { StellarService } from './stellar.service';
import { StellarController } from './stellar.controller';
import { HsmModule } from '../hsm/hsm.module';

@Module({
  imports: [forwardRef(() => HsmModule)],
  providers: [StellarService],
  controllers: [StellarController],
  exports: [StellarService],
})
export class StellarModule {}
