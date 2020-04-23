import { Query, Resolver, Mutation, Arg, Authorized } from "type-graphql";
import { User } from "../../entity/User";
import { RegisterInput } from "./InputTypes/RegisterInput";
import { createUser } from "../../entity/commands/user";
import { findAllUsers } from "../../entity/queries/user";

@Resolver()
export class RegisterResolver {
  @Query(() => [User])
  @Authorized()
  users() {
    return findAllUsers();
  }

  @Mutation(() => User)
  async signUp(@Arg("input") input: RegisterInput): Promise<User> {
    const newUser = await createUser(input);
    return newUser;
  }
}
