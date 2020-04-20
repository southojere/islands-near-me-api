import { InputType, Field } from "type-graphql";
import { Length, IsEmail } from "class-validator";
import { IsUserAlreadyExist } from "../ValidationTypes/isEmailAlreadyExists";

@InputType()
export class RegisterInput {
  @Field()
  @Length(3, 30)
  username: string;

  @Field()
  @IsEmail()
  @IsUserAlreadyExist({ message: "Email already being used." })
  email: string;

  @Field()
  password: string;
}
