// contract.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ethers } from 'ethers';
import { contractAddressesUtil } from 'src/utils/contract-address';
import { erc6059Abi } from './util/erc6059-abi';
import { Erc6059Service } from './erc6059.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Nft6059Entity } from './entities/nft_6059.entity';
import { Repository } from 'typeorm';
import { Nft6059OwnersEntity } from './entities/nft-owners';
import { SaveNewErc6059FunParam } from './util/data-type';

@Injectable()
export class ERC6059ListnerService implements OnModuleInit {
  private provider: ethers.providers.JsonRpcProvider;
  private contract: ethers.Contract;

  constructor(
    @InjectRepository(Nft6059Entity)
    private readonly nft6059Entity: Repository<Nft6059Entity>,
    @InjectRepository(Nft6059OwnersEntity)
    private readonly nft6059OnwerEntity: Repository<Nft6059OwnersEntity>,
  ) {
    this.provider = new ethers.providers.JsonRpcProvider(
      process.env.ELYSIUM_RPC,
    );

    this.contract = new ethers.Contract(
      contractAddressesUtil.ERC_6059,
      erc6059Abi,
      this.provider,
    );
  }

  async saveNewMintedNft(data: SaveNewErc6059FunParam) {
    try {
      const nft = new Nft6059Entity();
      nft.tokenId = data.tokenId;

      const nftOwner = new Nft6059OwnersEntity();
      nftOwner.onwer_address = data.to;

      await this.nft6059OnwerEntity.save(nftOwner);

      nft.owner = nftOwner;
      nft.isMinted = true;
      nft.tx_hash = data.txHash;

      await this.nft6059Entity.save(nft);
    } catch (error) {
      console.log(error);
    }
  }

  async onModuleInit() {
    console.log("Listening for 'Transfer' event on contract: ");
    this.contract.on('Transfer', async (from, to, tokenId, event: any) => {
      // Update the event to the database
      const nft: Nft6059Entity = await this.nft6059Entity.findOne({
        where: { tokenId: parseInt(tokenId.toString()) },
        relations: {
          owner: true,
        },
      });

      if (!nft) {
        console.log('Saving new minted NFT: ', tokenId.toString());
        await this.saveNewMintedNft({
          tokenId: parseInt(tokenId.toString()),
          to: to,
          txHash: event.transactionHash,
        });
        return;
      } else {
        console.log("Updating NFT's owner: ", tokenId.toString());
        nft.isMinted = true;
        const nftOwner = await this.nft6059OnwerEntity.findOne({
          where: { id: nft.owner.id },
        });
        nftOwner.onwer_address = to;
        await this.nft6059Entity.save(nft);
        await this.nft6059OnwerEntity.save(nftOwner);
        return;
      }
    });
  }
}
