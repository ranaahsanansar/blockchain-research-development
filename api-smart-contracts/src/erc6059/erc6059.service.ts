import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ThirdwebService } from 'src/thirdweb/thirdweb.service';
import { MintNftDto, NestMintNft } from './dto/mint-nft.dto';
import { contractAddressesUtil } from 'src/utils/contract-address';
import { InjectRepository } from '@nestjs/typeorm';
import { Nft6059Entity } from './entities/nft_6059.entity';
import { Nft6059OwnersEntity } from './entities/nft-owners';
import { Repository } from 'typeorm';
import { CustomFile, GenerateNftObjFunParam } from './util/data-type';
import { BackblazeService } from 'src/backblaze/backblaze.service';
import { generateNewNftandOwner } from './util/helper-functions';

@Injectable()
export class Erc6059Service {
  private readonly logger = new Logger(Erc6059Service.name);
  private readonly contractAddress = contractAddressesUtil.ERC_6059Sepolia;

  constructor(
    @Inject(ThirdwebService) private thirdWebSdk: ThirdwebService,
    @InjectRepository(Nft6059Entity)
    private readonly nft6059: Repository<Nft6059Entity>,
    @InjectRepository(Nft6059OwnersEntity)
    private readonly nft6059Owners: Repository<Nft6059OwnersEntity>,
    private readonly uploadB2: BackblazeService,
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

  private async uploadFile(file: CustomFile): Promise<any> {
    await this.uploadB2.authorizeB2();
    const bucketId = process.env.BUCKET_ID;
    const fileName = `${Date.now()}-${file.originalname}`;
    const fileData = file.buffer;
    const uploadResponse = await this.uploadB2.uploadFile(
      bucketId,
      fileName,
      fileData,
    );
    // console.log('File Uploaded to Backblaze B2: ' , uploadResponse);
    return uploadResponse.data;
  }

  private async uploadToBackblazeAndSaveInDb(
    file: CustomFile,
    nftData: GenerateNftObjFunParam,
    isChild: boolean,
  ) {
    // upload the file to backblaze
    console.log('Uploading');
    const uploadResponse = await this.uploadFile(file);
    const imageUrl = process.env.BUCKET_BASE_URL + uploadResponse.fileName;
    nftData.nftUrl = imageUrl;

    // save the nft to db
    const { nft, owner } = generateNewNftandOwner(nftData);
    // nft.isChild = isChild;

    await this.nft6059Owners.save(owner);
    await this.nft6059.save(nft);
  }

  async mint(body: MintNftDto, file: CustomFile): Promise<any> {
    try {
      // check if nft already exists

      if (await this.checkIfNftExists(body.tokenId)) {
        throw new HttpException('NFT already exists', HttpStatus.CONFLICT);
      }

      // Upload fiel and save in DB
      const nftData: GenerateNftObjFunParam = {
        nftName: body.nftName,
        nftUrl: '',
        to: body.to,
        tokenId: body.tokenId,
        tx_hash: null,
        contract_address: this.contractAddress,
      };
      await this.uploadToBackblazeAndSaveInDb(file, nftData, false);

      // mint the nft
      console.log('Miniting');
      const result = await this.thirdWebSdk.callContractFunction(
        this.contractAddress,
        'mint',
        [body.to, body.tokenId],
      );

      return result;
    } catch (error) {
      this.throwHttpException(error);
    }
  }

  async nestMint(body: NestMintNft, file: CustomFile): Promise<any> {
    try {
      if (await this.checkIfNftExists(body.newChildId)) {
        throw new HttpException('NFT already exists', HttpStatus.CONFLICT);
      }

      const parentNft = await this.nft6059.findOne({
        where: { tokenId: body.parentId },
      });

      const nftData: GenerateNftObjFunParam = {
        nftName: body.childNftName,
        nftUrl: '',
        to: parentNft.contract_address,
        tokenId: body.newChildId,
        tx_hash: null,
        contract_address: this.contractAddress,
      };

      await this.uploadToBackblazeAndSaveInDb(file, nftData, true);

      // mint the nft
      console.log('Nest Miniting');
      const result = await this.thirdWebSdk.callContractFunction(
        this.contractAddress,
        'nestMint',
        [parentNft.contract_address, body.newChildId, body.parentId],
      );
      return result;
    } catch (error) {
      this.throwHttpException(error);
    }
  }

  async getAllErc6059(): Promise<any> {
    try {
      return await this.nft6059.find({
        where: { isMinted: true },
        relations: {
          owner: true,
        },
        order: {
          created_at: 'ASC',
        },
      });
    } catch (error) {
      this.throwHttpException(error);
    }
  }
}
