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
import {
  createSession,
  deleteSessionById,
  toggleSessionFull
} from "../entity/commands/session";
import { createJoinRequest } from "../entity/commands/sessionRequest";
import { findUserById } from "../entity/queries/user";
import { AuthenticationError } from "apollo-server-core";
import { findUsersSessionRequest } from "../entity/queries/sessionRequests";

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

  @Field({ defaultValue: false })
  isPrivate: boolean;
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
  @Query(() => Session)
  async session(@Arg("id") id: number) {
    return findSessionById(id);
  }

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

  @Mutation(() => Boolean)
  async requestToJoin(
    @Ctx() ctx: any,
    @Arg("id", () => Int) session_id: number,
    @Arg("message", { nullable: true }) message: string
  ) {
    const { user } = ctx;
    if (!user) {
      throw new AuthenticationError(
        `Need to be logged in to request to join someone`
      );
    }
    const userModel = await findUserById(user.id);
    if (!userModel) {
      throw new AuthenticationError("User not found - cannot join session");
    }

    const session = await findSessionById(session_id);
    if (!session) throw new Error(`Can't find session to join`);

    const usersRequests = await findUsersSessionRequest(user.id);
    const existingRequest = usersRequests.find(
      joinRequest => joinRequest.session.id === session_id
    );
    if (existingRequest) {
      throw new Error(`You have already requested to join this session`);
    }
    await createJoinRequest(session, userModel, message);

    return true;
  }
}
