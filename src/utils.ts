import { VISITORS, SessionRequestStatus } from "./constants";

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

const statusText = (status: any) => {
  switch (status) {
    case SessionRequestStatus.PENDING_RESPONSE:
      return "Pending Response";
    case SessionRequestStatus.NOT_ACCEPTED:
      return "Denied";
    case SessionRequestStatus.ACCEPTED:
      return "Accepted";
    default:
      return "Unknown Status";
  }
};

export { getSessionVisitorWhere, statusText };
