import { BaseEntity, Entity, ObjectID, Column, CreateDateColumn, UpdateDateColumn, ObjectIdColumn } from 'typeorm';

@Entity('jobs')
export class Job extends BaseEntity {
  @ObjectIdColumn()
  id: ObjectID;

  @Column({
    nullable: false,
  })
  youtubeUrl: string;

  @Column({
    nullable: false,
  })
  youtubeId: string;

  @Column({
    nullable: true,
  })
  gifUrl: string;

  @Column({
    nullable: false,
  })
  startTime: number;

  @Column({
    nullable: false,
  })
  endTime: number;

  @Column({
    nullable: false,
  })
  status: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
