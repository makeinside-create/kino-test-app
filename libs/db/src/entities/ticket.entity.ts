import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { ObjectType, Field, Int, InputType, ID, registerEnumType } from '@nestjs/graphql';
import { Event } from './event.entity';
import { User } from './user.entity';

export enum TicketStatus {
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED',
}

registerEnumType(TicketStatus, {
  name: 'TicketStatus',
});


@Entity('tickets')
@Unique(['eventId', 'seat'])
@ObjectType()
export class Ticket {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  id!: string;

  @Column({ name: 'eventId' })
  @Field()
  eventId!: string;

  @ManyToOne(() => Event)
  @JoinColumn({ name: 'eventId' })
  event!: Event;

  @Column()
  @Field(() => Int)
  seat!: number;

  @Column({
    type: 'enum',
    enum: TicketStatus,
    default: TicketStatus.AVAILABLE,
  })
  @Field(() => TicketStatus)
  status!: TicketStatus;

  @Column({ name: 'userId', nullable: true })
  @Field({ nullable: true })
  userId?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user?: User;
}
