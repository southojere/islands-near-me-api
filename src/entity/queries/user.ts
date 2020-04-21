import { User } from "../User";

const findUserById = (id: number) => {
  return User.findOne({
    where: {
      id
    }
  });
};

export { findUserById };
