import { Resolver, Mutation, Arg, Ctx, ObjectType, Field } from "type-graphql";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { User } from "../../entity/User";
import { GraphQLError } from "graphql";
import config from "../../config";

@ObjectType()
class LoginObject {
  @Field()
  user: User;

  @Field()
  accessToken: string;
}

@Resolver()
export class LoginResolver {
  @Mutation(() => LoginObject)
  async login(
    @Arg("username") username: string,
    @Arg("password") password: string,
    @Ctx() ctx: any
  ): Promise<LoginObject> {
    const user = await User.findOne({
      where: {
        username
      }
    });

    if (!user) throw new GraphQLError("Cant find user");

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) throw new GraphQLError("Cant find user");

    const token = await jwt.sign(
      {
        userId: user.id,
        userEmail: user.email
      },
      config.auth.secret,
      {
        expiresIn: "100d"
      }
    );
    ctx.res.cookie("access-token", token);
    return { user, accessToken: token };
  }
}
