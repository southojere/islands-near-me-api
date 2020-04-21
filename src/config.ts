const config = {
  timezone: {
    default: "Australia/NSW"
  },
  auth: {
    secret: process.env.JWT_SECRET || "jeremy-my$3cr3t"
  }
};

export default config;
