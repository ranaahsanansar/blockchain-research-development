import { Module } from '@nestjs/common';
import { Erc6059Service } from './erc6059.service';
import { Erc6059Controller } from './erc6059.controller';
import { ThirdwebService } from 'src/thirdweb/thirdweb.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nft6059 } from './entities/nft_6059.entity';
import { Nft6059Owners } from './entities/nft-owners';

@Module({
  imports: [TypeOrmModule.forFeature([Nft6059, Nft6059Owners])],
  providers: [Erc6059Service, ThirdwebService],
  controllers: [Erc6059Controller],
})
export class Erc6059Module {}
