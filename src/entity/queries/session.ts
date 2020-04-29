import { Session } from "../Session";
import { SessionSearchInput } from "../../resolvers/Session";
import { getConnection } from "typeorm";
import Geopoint from "geopoint";

const findAllSessions = async ({
  keyword,
  limit,
  searchType,
  skip,
  nearMeRadius,
  latitude,
  longitude
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
    return getConnection()
      .getRepository(Session)
      .createQueryBuilder("session")
      .leftJoinAndSelect("session.user", "user")
      .where(keyword ? `session.dodoCode ILIKE '%${keyword}%'` : "")
      .orWhere(keyword ? `user.username ILIKE '%${keyword}%'` : "")
      .take(limit || 20)
      .skip(skip || 0)
      .printSql()
      .getManyAndCount();
  }
  //   return Session.findAndCount({
  //     order: {
  //       id: "ASC"
  //     },
  //     where,
  //     skip: skip || 0,
  //     take: limit || 20,
  //     join: {
  //       alias: "user"
  //     }
  //   });
};

const findSessionById = (id: number) => {
  return Session.findOne({
    where: {
      id
    }
  });
};

export { findAllSessions, findSessionById };
