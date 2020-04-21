import "reflect-metadata";
import { createConnection, getConnectionOptions } from "typeorm";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

import { RegisterResolver } from "./resolvers/user/Register";
import { LoginResolver } from "./resolvers/user/Login";
import { MeResolver } from "./resolvers/user/Me";

import { findUserById } from "./entity/queries/user";
import config from "./config";

(async () => {
  const app = express();

  const options = await getConnectionOptions(
    process.env.NODE_ENV || "development"
  );
  await createConnection({ ...options, name: "default" });

  app.use(cookieParser());

  const addUser = async (req: any, _: any, next: any) => {
    const accessToken = req.cookies["access-token"];
    if (accessToken) {
      try {
        const { userId }: any = jwt.verify(accessToken, config.auth.secret);
        const user = await findUserById(userId);
        req.user = user;
      } catch (err) {}
    }
    next();
  };

  app.use(addUser);

  const apolloServer = new ApolloServer({
    introspection: true,
    playground: true,
    schema: await buildSchema({
      resolvers: [RegisterResolver, LoginResolver, MeResolver],
      validate: true,
      authChecker: ({ context }) => {
        const user = context.user;
        if (!user) return false;
        // TODO add more custom auth logic here
        return true;
      }
    }),
    context: ({ req, res }: any) => {
      return { req, res, user: req.user };
    }
  });

  apolloServer.applyMiddleware({ app, cors: false });
  const port = process.env.PORT || 8000;
  app.listen(port, () => {
    console.log(`server started at http://localhost:${port}/graphql`);
  });
})();
