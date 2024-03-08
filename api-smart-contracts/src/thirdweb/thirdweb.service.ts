import { Injectable } from '@nestjs/common';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { ElysiumTestnet } from '@thirdweb-dev/chains';
import { chainNames } from 'src/utils/chain-names';

@Injectable()
export class ThirdwebService {
  private readonly sdk: ThirdwebSDK;

  constructor() {
    if (!process.env.THIRDWEB_SECRET_KEY) {
      throw new Error('Missing Thirdweb secret key or chain ID in .env');
    }

    this.sdk = new ThirdwebSDK(ElysiumTestnet, {
      secretKey: process.env.THIRDWEB_SECRET_KEY,
    });

    this.sdk = ThirdwebSDK.fromPrivateKey(
      process.env.WALLET_PRIVATE_KEY as string,
      chainNames.ElysiumTest,
      {
        secretKey: process.env.THIRDWEB_SECRET_KEY,
      },
    );
  }

  async getContract(contractAddress: string) {
    return await this.sdk.getContract(contractAddress);
  }

  async callContractFunction(
    contractAddress: string,
    functionName: string,
    args: any[],
  ) {
    const contract = await this.getContract(contractAddress);
    return await contract.call(functionName, args);
  }
}
