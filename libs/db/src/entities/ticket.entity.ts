import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ObjectType, Field, Int, InputType, ID } from '@nestjs/graphql';
import { Event } from './event.entity';

export enum TicketStatus {
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED',
}


@Entity('tickets')
@ObjectType()
export class Ticket {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  id: string;

  @Column({ name: 'eventId' })
  @Field()
  eventId: string;

  @ManyToOne(() => Event)
  @JoinColumn({ name: 'eventId' })
  event: Event;

  @Column()
  @Field(() => Int)
  seat: number;

  @Column({
    type: 'enum',
    enum: TicketStatus,
    default: TicketStatus.AVAILABLE,
  })
  @Field()
  status: TicketStatus;

  @Column({ name: 'userId', nullable: true })
  @Field({ nullable: true })
  userId?: string;
}
