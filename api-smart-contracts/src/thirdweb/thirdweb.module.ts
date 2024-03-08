import { Module } from '@nestjs/common';
import { ThirdwebService } from './thirdweb.service';

@Module({
  providers: [ThirdwebService],
})
export class ThirdwebModule {}
