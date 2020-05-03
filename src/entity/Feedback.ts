import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    CreateDateColumn,
    JoinColumn,
    ManyToOne
  } from "typeorm";
  import { ObjectType, Field, ID } from "type-graphql";
  import { User } from "./User";
  
  @Entity()
  @ObjectType()
  export class Feedback extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;
  
    @Field()
    @Column()
    message: string;
  
    @Field()
    @Column()
    feedbackType: string;
  
    @ManyToOne(() => User, user => user.feedback)
    @JoinColumn()
    user: User;
  
    @CreateDateColumn()
    @Field()
    createdAt: string;
  }
  