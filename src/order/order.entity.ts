import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('order')
export class Order {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  userId: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  meal: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  place: string;

  @Column('varchar', { array: true })
  items: string[];
}
