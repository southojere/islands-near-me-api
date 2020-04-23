import { Session } from "../../entity/Session";
import { findUserById } from "../queries/user";

interface ISessionInput {
  note?: string;
  dodoCode: string;
  latitude: string;
  longitude: string;
}

const createSession = async (userId: number, input: ISessionInput) => {
  const existingSession = await Session.findOne({
    where: {
      hostId: userId
    }
  });

  if (existingSession) {
    throw new Error(`Cant create a new session when an old session is active`);
  }
  const user = await findUserById(userId);
  if (!user) throw new Error(`Cant find user`);

  const newSession = await Session.create({
    hostId: userId,
    latitude: input.latitude,
    longitude: input.longitude,
    note: input.note,
    dodoCode: input.dodoCode,
  }).save();

  user.session = newSession;
  user.save();

  return newSession;
};

export { createSession };
