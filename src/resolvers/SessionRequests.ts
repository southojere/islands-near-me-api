import { Resolver, Query, Arg, Ctx, Mutation, Int } from "type-graphql";
import { AuthenticationError } from "apollo-server-core";
import { SessionRequest } from "../entity/SessionRequest";
import { findSessionRequestById, findUsersSessionRequest } from "../entity/queries/sessionRequests";
import { updateRequestStatus } from "../entity/commands/sessionRequest";

@Resolver()
export class SessionRequestResolver {
  @Query(() => [SessionRequest])
  async listRequests(
    @Ctx() ctx: any,
  ): Promise<any> {
    const { user } = ctx;
    if (!user) {
      throw new AuthenticationError("User not found - cant delete session");
    }
    return findUsersSessionRequest(user.id);
  }

  @Mutation(() => SessionRequest)
  async updateSessionRequestStatus(
    @Ctx() ctx: any,
    @Arg("id", () => Int) session_request_id: number,
    @Arg("status", () => Int) status: number
  ) {
    const { user } = ctx;
    if (!user) {
      throw new AuthenticationError("User not found");
    }
    let sessionRequest = await findSessionRequestById(session_request_id);
    if (!sessionRequest) {
      throw new Error(`Could not find Session Request to update`);
    }
    sessionRequest = await updateRequestStatus(sessionRequest, status);
    return sessionRequest;
  }
}
