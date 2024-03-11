import { ApiProperty } from '@nestjs/swagger';

export class MintNftDto {
  @ApiProperty({ description: 'Address of the recipient of the NFT' })
  to: string;

  @ApiProperty({ description: 'Token ID' })
  tokenId: number;

  @ApiProperty({ description: 'Name of nft' })
  nftName: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}
