import Geopoint from "geopoint";
import { Session } from "../Session";
import { SessionSearchInput } from "../../resolvers/Session";
import { getSessionVisitorWhere } from "../../utils";

const findAllSessions = async ({
  limit,
  searchType,
  skip,
  nearMeRadius,
  latitude,
  longitude,
  visitor
}: SessionSearchInput) => {
  if (searchType === "NEARME") {
    if (!latitude || !longitude)
      throw new Error(`Need to provide lat and long to find sessions near you`);
    const currentUsersLocation = new Geopoint(
      parseFloat(latitude),
      parseFloat(longitude)
    );
    const allSessions = await Session.find();
    const sessionsNearMe = allSessions.filter(session => {
      const sessionLocation = new Geopoint(
        parseFloat(session.latitude),
        parseFloat(session.longitude)
      );
      if (
        sessionLocation.distanceTo(currentUsersLocation, true) < nearMeRadius
      ) {
        return true;
      }
      return false;
    });
    return [sessionsNearMe, sessionsNearMe.length];
  } else {
    const where: any = {};
    if (visitor) {
      where[getSessionVisitorWhere(visitor)] = true;
    }
    return Session.findAndCount({
      relations: ["user"],
      where: {
        ...where
      },
      take: limit || 20,
      skip: skip || 0
    });
  }
};

const findSessionById = (id: number) => {
  return Session.findOne({
    where: {
      id
    }
  });
};

const findUsersSession = (userId: number) => {
  return Session.findOne({
    where: {
      hostId: userId
    }
  });
};

export { findAllSessions, findSessionById, findUsersSession };
