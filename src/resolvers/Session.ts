import {
  Resolver,
  Query,
  Mutation,
  InputType,
  Field,
  Arg,
  Ctx,
  Int,
  ObjectType
} from "type-graphql";
import { Session } from "../entity/Session";
import { findAllSessions, findSessionById } from "../entity/queries/session";
import { createSession, deleteSessionById, toggleSessionFull } from "../entity/commands/session";
import { findUserById } from "../entity/queries/user";
import { AuthenticationError } from "apollo-server-core";

@InputType()
export class SessionInput {
  @Field({ nullable: true })
  note: string;

  @Field()
  dodoCode: string;

  @Field()
  latitude: string;

  @Field()
  longitude: string;

  @Field({ defaultValue: false })
  hasRedd: boolean;
  @Field({ defaultValue: false })
  hasLeif: boolean;
  @Field({ defaultValue: false })
  hasKicks: boolean;
  @Field({ defaultValue: false })
  hasSaharah: boolean;
  @Field({ defaultValue: false })
  hasCeleste: boolean;
}

@InputType()
export class SessionSearchInput {
  @Field(() => Int, { nullable: true })
  skip: number;

  @Field(() => Int, { nullable: true })
  limit: number;

  @Field({ nullable: true })
  keyword: string;

  @Field({ nullable: true })
  searchType: string;

  @Field(() => Int, { nullable: true, defaultValue: 25 })
  nearMeRadius: number;

  @Field({ nullable: true })
  latitude: string;

  @Field({ nullable: true })
  longitude: string;

  @Field({ nullable: true })
  visitor: number;
}

@ObjectType()
class PaginatedSessions {
  @Field()
  total: number;

  @Field(() => [Session])
  sessions: Session[];
}

@Resolver()
export class SessionResolver {
  @Query(() => PaginatedSessions)
  async listSessions(@Arg("filter") filter: SessionSearchInput): Promise<any> {
    const [sessions, total] = await findAllSessions(filter);
    return { sessions, total };
  }

  @Mutation(() => Session)
  async createSession(@Ctx() ctx: any, @Arg("input") input: SessionInput) {
    const { user } = ctx;
    if (!user) {
      throw new AuthenticationError("Please login to create a session");
    }
    const userModel = await findUserById(user.id);
    if (!userModel)
      throw new AuthenticationError("User not found - cant create session");
    const session = await createSession(userModel.id, input);
    return session;
  }

  @Mutation(() => Boolean)
  async deleteSession(@Ctx() ctx: any, @Arg("id", () => Int) id: number) {
    const { user } = ctx;
    if (!user) {
      throw new AuthenticationError("User not found - cant delete session");
    }
    const session = await findSessionById(id);
    if (!session) throw new Error(`Could not find session (${id})`);

    if (session.hostId !== user.id) {
      throw new Error(`Can't remove a session that isn't yours`);
    }

    return deleteSessionById(session);
  }


  @Mutation(() => Session)
  async toggleSessionFull(@Ctx() ctx: any, @Arg("id", () => Int) id: number) {
    const { user } = ctx;
    if (!user) {
      throw new AuthenticationError("User not found");
    }
    const session = await findSessionById(id);
    if (!session) throw new Error(`Could not find session (${id})`);

    if (session.hostId !== user.id) {
      throw new Error(`Can't remove a session that isn't yours`);
    }

    return toggleSessionFull(session);
  }
}
