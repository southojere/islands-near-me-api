import { Session } from "../Session";
import { SessionSearchInput } from "../../resolvers/Session";
import { Like } from "typeorm";

const findAllSessions = ({
  keyword,
  limit,
  searchType,
  skip
}: SessionSearchInput) => {
  console.log(searchType);
  const where:any = {}

  if(keyword) {
      where.dodoCode = Like(`%${keyword}%`);
  }
  return Session.findAndCount({
    order: {
      id: "ASC"
    },
    where,
    skip: skip || 0,
    take: limit || 20
  });
};

const findSessionById = (id: number) => {
  return Session.findOne({
    where: {
      id
    }
  });
};

export { findAllSessions, findSessionById };
