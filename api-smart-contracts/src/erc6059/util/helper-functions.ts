import { Nft6059OwnersEntity } from '../entities/nft-owners';
import { Nft6059Entity } from '../entities/nft_6059.entity';
import { GenerateNftObjFunParam } from './data-type';

export const generateNewNftandOwner = (
  data: GenerateNftObjFunParam,
): { nft: Nft6059Entity; owner: Nft6059OwnersEntity } => {
  const nft = new Nft6059Entity();
  nft.nft_name = data.nftName;
  nft.nft_uri = data.nftUrl;
  nft.tokenId = data.tokenId;
  nft.tx_hash = data.tx_hash;
  nft.contract_address = data.contract_address;

  const owner = new Nft6059OwnersEntity();
  owner.onwer_address = data.to;

  nft.owner = owner;

  return { nft: nft, owner: owner };
};
