import {
  Resolver,
  Query,
  Mutation,
  InputType,
  Field,
  Arg,
  Ctx,
  Int
  //   ObjectType
} from "type-graphql";
import { Session } from "../entity/Session";
import { findAllSessions, findSessionById } from "../entity/queries/session";
import { createSession, deleteSessionById } from "../entity/commands/session";
import { findUserById } from "../entity/queries/user";
import { AuthenticationError } from "apollo-server-core";

@InputType()
class SessionInput {
  @Field({ nullable: true })
  note: string;

  @Field()
  dodoCode: string;

  @Field()
  latitude: string;

  @Field()
  longitude: string;
}

// @ObjectType()
// class PaginatedSessions extends BaseEntity {
//   @Field()
//   total: number;
//   @Field()
//   sessions: any;
// }

@Resolver()
export class SessionResolver {
  @Query(() => [Session])
  async listSessions() {
    const [sessions] = await findAllSessions();
    return sessions;
  }

  @Mutation(() => Session)
  async createSession(@Ctx() ctx: any, @Arg("input") input: SessionInput) {
    const { user } = ctx;
    if (!user) {
      throw new AuthenticationError("User not found - cant create session");
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
}
