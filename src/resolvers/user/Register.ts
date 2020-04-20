import { Query, Resolver, Mutation, Arg } from "type-graphql";
import bcrypt from "bcryptjs";
import { User } from "../../entity/User";
import { RegisterInput } from "./InputTypes/RegisterInput";

@Resolver()
export class RegisterResolver {
  @Query(() => [User])
  users() {
    return User.find();
  }

  @Mutation(() => User)
  async signUp(@Arg("input") input: RegisterInput): Promise<User> {
    const { email, password, username } = input;
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User();
    user.email = email;
    user.password = hashedPassword;
    user.username = username;
    await User.save(user);

    return user;
  }
}
