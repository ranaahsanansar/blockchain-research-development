import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Nft6059OwnersEntity } from './nft-owners';

@Entity('nft_6059')
export class Nft6059Entity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  tokenId: number;

  @Column({ nullable: true })
  nft_name: string;

  @Column({ nullable: true })
  nft_uri: string;

  // @Column({ default: false })
  // isChild: boolean;

  @Column({ nullable: true })
  tx_hash: string;

  @Column({ nullable: false })
  contract_address: string;

  @Column({ default: false })
  isMinted: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // relations ----------

  @OneToOne(() => Nft6059OwnersEntity, (owner) => owner.nft_6059)
  @JoinColumn()
  owner: Nft6059OwnersEntity;
}
