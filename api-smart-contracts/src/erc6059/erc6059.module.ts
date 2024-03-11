import { Module } from '@nestjs/common';
import { Erc6059Service } from './erc6059.service';
import { Erc6059Controller } from './erc6059.controller';
import { ThirdwebService } from 'src/thirdweb/thirdweb.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nft6059Entity } from './entities/nft_6059.entity';
import { Nft6059OwnersEntity } from './entities/nft-owners';
import { ERC6059ListnerService } from './samrt-contract-listner.service';
import { BackblazeService } from 'src/backblaze/backblaze.service';

@Module({
  imports: [TypeOrmModule.forFeature([Nft6059Entity, Nft6059OwnersEntity])],
  providers: [
    Erc6059Service,
    ThirdwebService,
    ERC6059ListnerService,
    BackblazeService,
  ],
  controllers: [Erc6059Controller],
})
export class Erc6059Module {}
