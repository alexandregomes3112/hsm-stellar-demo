import { Module, forwardRef } from '@nestjs/common';
import { HsmService } from './hsm.service';
import { HsmController } from './hsm.controller';
import { StellarModule } from '../stellar/stellar.module';

@Module({
  imports: [forwardRef(() => StellarModule)],
  providers: [HsmService],
  controllers: [HsmController],
  exports: [HsmService],
})
export class HsmModule {}
