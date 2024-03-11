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

export class NestMintNft {
  // @ApiProperty({ description: 'Address of the recipient of the NFT' })
  // to: string;

  @ApiProperty({ description: 'Token ID of parent NFT' })
  parentId: number;

  @ApiProperty({ description: 'Token ID of child NFT' })
  newChildId: number;

  @ApiProperty({ description: 'Name of nft' })
  childNftName: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}
