import { Session } from "../Session";

const findAllSessions = () => {
  return Session.findAndCount({});
};

const findSessionById = (id: number) => {
  return Session.findOne({
    where: {
      id
    }
  });
};

export { findAllSessions, findSessionById };
