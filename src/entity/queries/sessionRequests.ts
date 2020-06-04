import { SessionRequest } from "../SessionRequest";
const findSessionRequestById = (id: number) => {
  return SessionRequest.findOne({
    where: {
      id
    }
  });
};

const findUsersSessionRequest = (userId: number) => {
  return SessionRequest.find({
    where: {
      user: {
        id: userId
      }
    },
    relations: ["session"]
  });
};


export { findSessionRequestById, findUsersSessionRequest };
