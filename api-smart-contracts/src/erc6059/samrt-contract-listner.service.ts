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
import {
  GenerateNftObjFunParam,
  SaveNewErc6059FunParam,
} from './util/data-type';
import { generateNewNftandOwner } from './util/helper-functions';

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
      process.env.SEPOLIA_RPC,
    );

    this.contract = new ethers.Contract(
      contractAddressesUtil.ERC_6059Sepolia,
      erc6059Abi,
      this.provider,
    );
  }

  async saveNewMintedNft(data: SaveNewErc6059FunParam) {
    try {
      const nftData: GenerateNftObjFunParam = {
        nftName: null,
        nftUrl: null,
        to: data.to,
        tokenId: data.tokenId,
        tx_hash: data.txHash,
        contract_address: contractAddressesUtil.ERC_6059Sepolia,
      };
      const { nft, owner } = generateNewNftandOwner(nftData);
      nft.isMinted = true;
      await this.nft6059OnwerEntity.save(owner);
      await this.nft6059Entity.save(nft);
    } catch (error) {
      console.log(error);
    }
  }

  async saveOrMintAfterEvent(
    nft: Nft6059Entity,
    tokenId: any,
    tx_hash: string,
    to: string,
  ): Promise<{ nft: Nft6059Entity; owner: Nft6059OwnersEntity }> {
    if (!nft) {
      console.log('Saving new minted NFT: ', tokenId.toString());
      await this.saveNewMintedNft({
        tokenId: parseInt(tokenId.toString()),
        to: to,
        txHash: tx_hash,
      });
      return;
    } else {
      console.log("Updating NFT's owner: ", tokenId.toString());
      nft.isMinted = true;
      nft.tx_hash = tx_hash;
      const nftOwner = await this.nft6059OnwerEntity.findOne({
        where: { id: nft.owner.id },
      });
      nftOwner.onwer_address = to;

      return { nft: nft, owner: nftOwner };
    }
  }

  async onModuleInit() {
    console.log("Listening for 'Transfer' event on contract: ");
    this.contract.on('Transfer', async (from, to, tokenId, event: any) => {
      // Update the event to the database
      const nftData: Nft6059Entity = await this.nft6059Entity.findOne({
        where: { tokenId: parseInt(tokenId.toString()) },
        relations: {
          owner: true,
        },
      });
      const { nft, owner } = await this.saveOrMintAfterEvent(
        nftData,
        tokenId,
        event.transactionHash,
        to,
      );
      await this.nft6059Entity.save(nft);
      await this.nft6059OnwerEntity.save(owner);
    });

    this.contract.on(
      'NestTransfer',
      async (from, to, parentId, destinationId, tokenId, event) => {
        const nftData: Nft6059Entity = await this.nft6059Entity.findOne({
          where: { tokenId: parseInt(tokenId.toString()) },
          relations: {
            owner: true,
          },
        });
        const { nft, owner } = await this.saveOrMintAfterEvent(
          nftData,
          tokenId,
          event.transactionHash,
          to,
        );
        await this.nft6059Entity.save(nft);
        await this.nft6059OnwerEntity.save(owner);
      },
    );
  }
}
