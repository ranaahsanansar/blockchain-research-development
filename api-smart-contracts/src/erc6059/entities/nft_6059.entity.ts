import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Nft6059Owners } from './nft-owners';

@Entity('nft_6059')
export class Nft6059 {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tokenId: number;

  @Column()
  nft_name: string;

  @Column()
  nft_uri: string;

  @Column({ default: false })
  isChild: boolean;

  @Column()
  tx_hash: string;

  @Column({ default: false })
  isMinted: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // relations ----------

  @OneToOne(() => Nft6059Owners, (owner) => owner.nft_6059)
  @JoinColumn()
  owner: Nft6059Owners;
}
