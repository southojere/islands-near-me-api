import { Session } from "../Session";

const findAllSessions = () => {
  return Session.findAndCount({});
};


export {
    findAllSessions
}