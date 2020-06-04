import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  ManyToOne,
  Column,
  Unique
} from "typeorm";
import { ObjectType, Field, ID, Root } from "type-graphql";
import { Session } from "./Session";
import { User } from "./User";
import { SessionRequestStatus } from "../constants";
import { statusText } from "../utils";

@ObjectType()
export class RequestStatus {
  @Field()
  label: String;
  @Field()
  code: number;
}

@Entity()
@ObjectType()
@Unique(["session", "user"])
export class SessionRequest extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: SessionRequestStatus.PENDING_RESPONSE })
  status: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  message: string;

  @Field(() => Session, { nullable: true })
  @ManyToOne(
    () => Session,
    session => session.sessionRequests,
    { onDelete: "CASCADE", nullable: true }
  )
  session: Session;

  @Field(() => User)
  @ManyToOne(
    () => User,
    user => user.sessionRequest,
    {
      eager: true
    }
  )
  user: User;

  @CreateDateColumn()
  @Field()
  createdAt: string;

  // Resolver fields

  @Field(() => RequestStatus, { name: "status" })
  statusObject(@Root() parent: SessionRequest): RequestStatus {
    return {
      label: statusText(parent.status),
      code: parent.status
    };
  }
}
