import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Nft6059 } from './nft_6059.entity';

@Entity('nft_6059_owners')
export class Nft6059Owners {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  onwer_address: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // relations ----------

  @OneToOne(() => Nft6059, (nft) => nft.owner)
  nft_6059: Nft6059;
}
