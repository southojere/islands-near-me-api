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

  @Field()
  uppercaseEmail(@Root() parent: User): string {
    return parent.email.toUpperCase();
  }

  @OneToOne(() => Session, { nullable: true })
  @JoinColumn()
  @Field({ nullable: true })
  session: Session;

  @OneToMany(() => Feedback, feedback => feedback.user)
  feedback: Feedback[];

  @CreateDateColumn()
  @Field()
  createdAt: string;

  @UpdateDateColumn()
  @Field()
  updatedAt: string;
}
