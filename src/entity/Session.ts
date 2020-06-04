import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany
} from "typeorm";
import { ObjectType, Field, ID, Root } from "type-graphql";
import { findUserById } from "./queries/user";
import { User } from "./User";
import { SessionRequest } from "./SessionRequest";

@Entity()
@ObjectType()
export class Session extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  dodoCode: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  note: string;

  @Field()
  @Column()
  latitude: string;

  @Field()
  @Column()
  longitude: string;

  @Field()
  @Column()
  hostId: number;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Field({ defaultValue: false })
  @Column({ default: false })
  hasCeleste: boolean;

  @Field({ defaultValue: false })
  @Column({ default: false })
  hasSaharah: boolean;

  @Field({ defaultValue: false })
  @Column({ default: false })
  hasKicks: boolean;

  @Field({ defaultValue: false })
  @Column({ default: false })
  hasLeif: boolean;

  @Field({ defaultValue: false })
  @Column({ default: false })
  hasRedd: boolean;

  @Field({ defaultValue: false })
  @Column({ default: false })
  isFull: boolean;

  // Indicates with this sessions dodo code is hidden from public view.
  @Field({ defaultValue: false })
  @Column({ default: false })
  isPrivate: boolean;

  @Field(() => User)
  host(@Root() parent: Session): Promise<User | undefined> {
    return findUserById(parent.hostId);
  }

  @Field(() => [SessionRequest])
  @OneToMany(
    () => SessionRequest,
    sessionRequest => sessionRequest.session,
    { onDelete: "CASCADE", eager: true }
  )
  sessionRequests: SessionRequest[];

  @CreateDateColumn()
  @Field()
  createdAt: string;
}
