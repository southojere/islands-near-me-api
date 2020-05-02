import cron from "node-cron";
import { LessThan, getConnection } from "typeorm";
import { Session } from "../entity/Session";
import { User } from "../entity/User";
var moment = require("moment");

cron.schedule("0 * * * *", async () => {
  const expiredSessions = await Session.find({
    where: {
      createdAt: LessThan(moment().subtract(2, "hours"))
    }
  });
  await Promise.all(
    expiredSessions.map(async session => {
      await getConnection()
        .createQueryBuilder()
        .update(User)
        .set({ session: undefined })
        .where("id = :id", { id: session.hostId })
        .execute();
      await session.remove();
      return true;
    })
  ).then(res => console.log(`Removing expired sessions: ${res.length}`));
});
