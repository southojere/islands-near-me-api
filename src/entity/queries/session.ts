import { Session } from "../Session";
import { SessionSearchInput } from "../../resolvers/Session";
import { Like, getConnection } from "typeorm";

const findAllSessions = ({
  keyword,
  limit,
  searchType,
  skip
}: SessionSearchInput) => {
  console.log(searchType);

  return getConnection()
    .getRepository(Session)
    .createQueryBuilder("session")
    .leftJoinAndSelect("session.user", "user")
    .where(keyword ? `session.dodoCode ILIKE '%${keyword}%'` : '')
    .orWhere(keyword ? `user.username ILIKE '%${keyword}%'` : '')
    .take(limit || 20)
    .skip(skip || 0)
    .printSql()
    .getManyAndCount();

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
