import { Session } from "../../entity/Session";
import { findUserById } from "../queries/user";
import { getConnection, getManager } from "typeorm";
import { User } from "../User";
import { SessionInput } from "../../resolvers/Session";

const createSession = async (userId: number, input: SessionInput) => {
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
    hasCeleste: input.hasCeleste,
    hasKicks: input.hasKicks,
    hasLeif: input.hasLeif,
    hasSaharah: input.hasSaharah,
    hasRedd: input.hasRedd,
    user: user
  }).save();

  user.session = newSession;
  user.save();

  return newSession;
};

const deleteSessionById = async (session: Session) => {
  const user = await findUserById(session.hostId);
  if (!user) throw new Error(`Could not find host of this session.`);
  // remove the foreign key on the users first
  await getConnection()
    .createQueryBuilder()
    .update(User)
    .set({ session: undefined })
    .where("id = :id", { id: session.hostId })
    .execute();

  // save to delete the session entry
  await session.remove();
  return true;
};

const toggleSessionFull = async (session: Session) => {
  const manager = getManager();
  session.isFull = !session.isFull;
  await manager.save(session);
  return session;
};

export { createSession, deleteSessionById, toggleSessionFull };
