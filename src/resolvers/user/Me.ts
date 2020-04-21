import { Resolver, Ctx, Query } from "type-graphql";
import { User } from "../../entity/User";
import { findUserById } from "../../entity/queries/user";

@Resolver()
export class MeResolver {
  @Query(() => User)
  async me(@Ctx() ctx: any): Promise<User | undefined | null> {
    const user = ctx.user;
    if (!user) return null;
    return findUserById(user.id);
  }
}
