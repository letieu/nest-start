import { BaseEntity, CreateDateColumn, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export abstract class BaseModelWithoutPrimary extends BaseEntity {
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  @Index()
  createdAt = new Date();

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt = new Date();

  static get modelName(): string {
    return this.name;
  }
}

export abstract class BaseModel extends BaseModelWithoutPrimary {
  @PrimaryGeneratedColumn()
  id: number;
}
