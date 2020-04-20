import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { ObjectType, Field, ID, Root } from "type-graphql";
import { IsEmail } from "class-validator";

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
}
