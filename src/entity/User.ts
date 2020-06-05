import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToOne,
  JoinColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany
} from "typeorm";
import { ObjectType, Field, ID, Root } from "type-graphql";
import { IsEmail } from "class-validator";
import { Session } from "./Session";
import { Feedback } from "./Feedback";
import { SessionRequest } from "./SessionRequest";

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  username: string;

  @Field()
  @Column()
  @IsEmail()
  email: string;

  @Field()
  @Column()
  password: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  islandName: string;

  @Field({ defaultValue: 0 })
  @Column({ default: 0 })
  numberOfSessionsCreated: number;
  
  @Field()
  uppercaseEmail(@Root() parent: User): string {
    return parent.email.toUpperCase();
  }

  @OneToOne(() => Session, { nullable: true })
  @JoinColumn()
  @Field({ nullable: true })
  session: Session;

  @OneToMany(
    () => Feedback,
    feedback => feedback.user
  )
  feedback: Feedback[];

  @OneToMany(
    () => SessionRequest,
    sessionRequest => sessionRequest.user
  )
  sessionRequest: SessionRequest[];

  @CreateDateColumn()
  @Field()
  createdAt: string;

  @UpdateDateColumn()
  @Field()
  updatedAt: string;
}
