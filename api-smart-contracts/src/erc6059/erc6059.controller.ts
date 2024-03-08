import { Body, Controller, Post } from '@nestjs/common';
import { MintNftDto } from './dto/mint-nft.dto';
import { Erc6059Service } from './erc6059.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('ERC-6059')
@Controller('erc6059')
export class Erc6059Controller {
  constructor(private erc6059Service: Erc6059Service) {}

  @Post('mint')
  async mint(@Body() body: MintNftDto): Promise<any> {
    return await this.erc6059Service.mint(body);
  }
}
