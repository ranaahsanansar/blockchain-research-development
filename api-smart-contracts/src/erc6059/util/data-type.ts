export type SaveNewErc6059FunParam = {
  txHash: string;
  to: string;
  tokenId: number;
};

export interface CustomFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

export type GenerateNftObjFunParam = {
  nftName: string;
  tokenId: number;
  to: string;
  nftUrl: string;
  tx_hash: string;
  contract_address: string;
};
