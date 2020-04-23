import {
  Resolver,
  Query,
  Mutation,
  InputType,
  Field,
  Arg,
  Ctx,
//   ObjectType
} from "type-graphql";
import { Session } from "../entity/Session";
import { findAllSessions } from "../entity/queries/session";
import { createSession } from "../entity/commands/session";
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
    console.log(sessions)
    return sessions;
  }

  @Mutation(() => Session)
  async createSession(@Ctx() ctx: any, @Arg("input") input: SessionInput) {
    const { user } = ctx;
    if (!user)
      throw new AuthenticationError("User not found - cant create session");
    const userModel = await findUserById(user.id);
    if (!userModel)
      throw new AuthenticationError("User not found - cant create session");
    const session = await createSession(userModel.id, input);
    return session;
  }
}
