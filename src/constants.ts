const VISITORS = {
  CELESTE: {
    VALUE: 1,
    TEXT: "Celeste"
  },
  SAHARAH: {
    VALUE: 2,
    TEXT: "Saharah"
  },
  KICKS: {
    VALUE: 3,
    TEXT: "Kicks"
  },
  LEIF: {
    VALUE: 6,
    TEXT: "Leif"
  },
  REDD: {
    VALUE: 7,
    TEXT: "Redd"
  }
};

const VISITOR_VALUE_MAP = {
  1: "CELESTE",
  2: "SAHARAH",
  3: "KICKS",
  6: "LEIF",
  7: "REDD"
};

export const SessionRequestStatus = {
  PENDING_RESPONSE: 0,
  NOT_ACCEPTED: 10,
  ACCEPTED: 20
};

export { VISITORS, VISITOR_VALUE_MAP };
