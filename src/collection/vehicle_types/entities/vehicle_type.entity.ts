import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity()
export class VehicleType extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  image: string;

  @Column('decimal')
  initPriceEth: number;

  @Column('decimal')
  initPriceBsc: number;

  @Column('decimal')
  initQuantityEth: number;

  @Column('decimal')
  initQuantityBsc: number;
}
