import { VISITORS } from "./constants";

const getSessionVisitorWhere = (visitorId: number): string => {
  switch (visitorId) {
    case VISITORS.CELESTE.VALUE:
      return "hasCeleste";
    case VISITORS.SAHARAH.VALUE:
      return "hasSaharah";
    case VISITORS.KICKS.VALUE:
      return "hasKicks";
    case VISITORS.LEIF.VALUE:
      return "hasLeif";
    case VISITORS.REDD.VALUE:
      return "hasRedd";
  }
  return "";
};

export { getSessionVisitorWhere };
