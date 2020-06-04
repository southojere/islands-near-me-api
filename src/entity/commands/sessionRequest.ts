import { Session } from "../../entity/Session";
import { User } from "../../entity/User";
import { SessionRequest } from "../../entity/SessionRequest";

const createJoinRequest = (session: Session, user: User, message: string) => {
  const request = new SessionRequest();
  request.session = session;
  request.user = user;
  request.message = message;
  return request.save();
};

const updateRequestStatus = (
  sessionRequest: SessionRequest,
  status: number
) => {
  sessionRequest.status = status;
  sessionRequest.save();
  return sessionRequest;
};

export { createJoinRequest, updateRequestStatus };
