import { User } from "../User";

const findUserById = (id: number) => {
  return User.findOne({
    where: {
      id
    },
    relations: ["session"]
  });
};

const findAllUsers = () => {
  return User.find({
    relations: ["session"]
  });
};

export { findUserById, findAllUsers };
