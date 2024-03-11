import {
  Body,
  Controller,
  Post,
  Get,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { MintNftDto, NestMintNft } from './dto/mint-nft.dto';
import { Erc6059Service } from './erc6059.service';
import { ApiTags, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('ERC-6059')
@Controller('erc6059')
export class Erc6059Controller {
  constructor(private erc6059Service: Erc6059Service) {}

  @Post('mint')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async mint(@Body() body: MintNftDto, @UploadedFile() file): Promise<any> {
    return await this.erc6059Service.mint(body, file);
  }

  @Get('get-all-erc6059')
  async getAllErc6059(): Promise<any> {
    return await this.erc6059Service.getAllErc6059();
  }

  @Post('nest-mint')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async nestMint(
    @Body() body: NestMintNft,
    @UploadedFile() file,
  ): Promise<any> {
    return await this.erc6059Service.nestMint(body, file);
  }
}
