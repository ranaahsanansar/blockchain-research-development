import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ThirdwebService } from 'src/thirdweb/thirdweb.service';
import { MintNftDto } from './dto/mint-nft.dto';
import { contractAddressesUtil } from 'src/utils/contract-address';
import { InjectRepository } from '@nestjs/typeorm';
import { Nft6059 } from './entities/nft_6059.entity';
import { Nft6059Owners } from './entities/nft-owners';
import { Repository } from 'typeorm';

@Injectable()
export class Erc6059Service {
  private readonly logger = new Logger(Erc6059Service.name);

  constructor(
    @Inject(ThirdwebService) private thirdWebSdk: ThirdwebService,
    @InjectRepository(Nft6059) private readonly nft6059: Repository<Nft6059>,
    @InjectRepository(Nft6059Owners)
    private readonly nft6059Owners: Repository<Nft6059Owners>,
  ) {}

  private throwHttpException(error: any) {
    this.logger.error(error.message);
    throw new HttpException(
      error.message || 'Internal Server Error',
      error.status || 500,
    );
  }

  private async checkIfNftExists(tokenId: number): Promise<boolean> {
    const nft = await this.nft6059.findOne({ where: { tokenId: tokenId } });
    if (nft) {
      return true;
    }
    return false;
  }

  async mint(body: MintNftDto): Promise<any> {
    try {
      // check if nft already exists
      if (await this.checkIfNftExists(body.tokenId)) {
        throw new HttpException('NFT already exists', HttpStatus.CONFLICT);
      }

      // mint the nft
      const result = await this.thirdWebSdk.callContractFunction(
        contractAddressesUtil.ERC_6059,
        'mint',
        [body.to, body.tokenId],
      );
      console.log(result);

      // save the nft to db
      const nft = new Nft6059();
      nft.nft_name = body.nftName;
      nft.nft_uri = body.nftUri;
      nft.tokenId = body.tokenId;
      nft.tx_hash = result.receipt.transactionHash;

      const owner = new Nft6059Owners();
      owner.onwer_address = body.to;
      nft.owner = owner;

      await this.nft6059.save(nft);
      return result;
    } catch (error) {
      this.throwHttpException(error);
    }
  }
}
