import { Resolver, Mutation, InputType, Field, Arg, Ctx } from "type-graphql";
import { findUserById } from "../entity/queries/user";
import { AuthenticationError } from "apollo-server-core";
import { Feedback } from "../entity/Feedback";
import { createFeedback } from "../entity/commands/feedback";

@InputType()
export class FeedbackInput {
  @Field()
  message: string;

  @Field()
  feedbackType: string;
}

@Resolver()
export class FeedbackResolver {
  @Mutation(() => Feedback)
  async createFeedback(@Ctx() ctx: any, @Arg("input") input: FeedbackInput) {
    const { user } = ctx;
    if (!user) {
      throw new AuthenticationError("Please login to create a session");
    }
    const userModel = await findUserById(user.id);
    if (!userModel)
      throw new AuthenticationError("User not found - cant create session");

    return createFeedback(user, input);
  }
}
