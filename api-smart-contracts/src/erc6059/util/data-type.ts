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
