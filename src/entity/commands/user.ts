import bcrypt from "bcryptjs";
import { User } from "../User";

interface IUserBaseInput {
  username: string;
  email: string;
  password: string;
}

const createUser = async (userInput: IUserBaseInput) => {
  const { email, username, password } = userInput;
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = new User();
  user.email = email;
  user.password = hashedPassword;
  user.username = username;
  await User.save(user);
  return user;
};

export { createUser };
